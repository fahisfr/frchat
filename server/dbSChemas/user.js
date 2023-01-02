const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: String,
  number: Number,
  profile: { type: String, default: "default_profile.jpg" },
  refreshToken: String,
  about: { type: String, default: "i am new here" },
  contacts: [
    {
      name: String,
      number: Number,
      messages: [
        {
          from: Number,
          text: String,
          date: { type: Date },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("users", user);
