const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: String,
  number: Number,
  profile: { type: String, default: "default_profile.jpg" },
  refreshToken: String,
  contacts: [
    {
      name: String,
      number: Number,
      message: [],
    },
  ],
});

module.exports = mongoose.model("users", user);
