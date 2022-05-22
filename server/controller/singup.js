const express = require("express");
const db = require("../config/dbConn")
const Jwt = require("jsonwebtoken")
const OTP = require("./otp");



const singup = async (req, res, next) => {
  try {
    const { name, number } = req.body;
    const user = await db.get().collection("users").findOne({ number })
    if (user) return res.json({ success: false, message: "this number already login" });
    OTP.create(number)
      .then(response => res.json({ success: true, message: "otp send successfully" }))
      .catch(error => res.json({ success: false, message: "faild to send OTP" }))

  } catch (error) {
    next(error)
  }
}



const verify = async (req, res, next) => {

  try {
    const { number, otp, name } = req.body;
    const OTPVerify = await OTP.verify(number, otp)
    if (OTPVerify.valid) {
      const accesstoken = Jwt.sign({ number, name }, process.env.ACCESS_TOKEN_SECRET)
      const refreshtoken = Jwt.sign({ number }, process.env.REFRESH_TOKEN_SECRET)
      const createNewUser = await db.get().collection("users").insertOne({ number, name, refreshtoken, contacts: [] })
      res.cookie('refreshtoken', refreshtoken, { maxAge: 806400000, httpOnly: false, });
      console.log("workd")
      return res.json({ success: true, message: "otp verified successfully", accesstoken });

    }
    res.json({ success: false, message: "otp is wrong" });

  } catch (error) {

    next(error);
  }
}

module.exports = {
  singup, verify
}

