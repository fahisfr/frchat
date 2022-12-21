const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const user = new mongoose.Schema({
  
  name: String,
  number: Number,
  profilePhoto: String,
  refreshToken: String,
  messages: [{}],
});

module.exports = mongoose.model("users", user);
