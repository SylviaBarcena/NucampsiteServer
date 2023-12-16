const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Will add the Currency type to the Mongoose Schema types
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

//This Schema object allows us to define the shape of our documents within a collection
const partnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Partner", partnerSchema);
