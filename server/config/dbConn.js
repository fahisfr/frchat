const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DATA_BASE_URL);
    console.log("Databases Connected");
  } catch (err) {
    console.error(err.message);
  }
};
module.exports = connectDB;
