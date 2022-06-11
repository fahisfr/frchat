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
      .catch(error => res.json({ success: false, message: "faild to send otp" }))

  } catch (error) {
    next(error)
  }
}



const verify = async (req, res, next) => {

  try {
    
    const { number, otp, name } = req.body;
    const { valid } = await OTP.verify(number, otp)
    
    if (valid) {
      
      const accesstoken = Jwt.sign({ number, name }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "30m" })
      const refreshtoken = Jwt.sign({ number }, process.env.REFRESH_TOKEN_SECRET,{expiresIn: "30d"})

      db.get().collection("users").insertOne({ number, name, refreshtoken, contacts: [] })
        .then(resutl => {
          res.cookie("auth_token", refreshtoken, { httpOnly: false, secure: true, maxAge: 30 * 60 * 60 * 1000 });
          return res.json({ success: true, message: "otp verified successfully", accesstoken });
        })
        .catch(error => next(error))

    }

    res.json({ success: false, message: "otp is wrong" });

  } catch (error) {

    next(error);
  }
}

module.exports = {
  singup, verify
}

