const express = require("express");
const User = require("../models/user");

const router = express.Router();

const passport = require("passport");

const authenticate = require("../authenticate");

//cors
const cors = require("./cors");

/* GET users listing. */
//before authentication
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });

router.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      })
      .catch((err) => next(err));
  }
);

//Sign up
router.post("/signup", cors.corsWithOptions, (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});

//Login
router.post(
  "/login",
  cors.corsWithOptions,
  passport.authenticate("local"),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  }
);

//check if the user is already logged in
router.post("/logout", cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.setHeader("session-id");
    // res.redirect('/');
    // console.log('You are logged out!');
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, status: "You are logged out!" });
  } else {
    const err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
});

//facebook
router.get(
  "/facebook/token",
  passport.authenticate("facebook-token"),
  (req, res) => {
    if (req.user) {
      const token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
  }
);

module.exports = router;
