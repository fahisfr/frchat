// const router = require('express').Router()
// const twilio = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
// const Jwt = require("jsonwebtoken")



// router.get("/", (req, res, next) => {
//     try {
//         const { number, otp } = req.body;
//         const OtpServer = twilio.verify.services(process.env.TWILIO_SERVICE_id)
//         OtpServer.verificationChecks.create({ to: `+91${number}`, code: otp }).then(respose => {
//             const accessToken = Jwt.sign({ name: user.name, number: user.number, }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h", });
//             const refreshToken = Jwt.sign({ name: user.name, number: user.number, }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d", });
//             res.cookie("refreshToken", refreshToken, { httpOnly: false, maxAge: 604800000 });
//             res.json({ success: true, message: "otp verify successfully", accessToken, });
//         })
//     } catch (error) {
//         next(error);
//     }
// })
// module.exports = {
//     login,
//     verify,
// }