
const db = require("../Config/DBconn");
const OTP = require("./Otp")
const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
    try {
        const { number } = req.body;
        console.log(number)
        const client = await db.get().collection("users").findOne({ number:parseInt(number) })
        if (!client) return res.json({ success: false, message: "number  was wrong" });
        OTP.create(number)
            .then(reulst => res.json({ success: true, message: "otp send successfully" }))
            .catch(error => {res.json({ success: false, message:error.message })})
    } catch (error) {
        next(error);
    }
}

const verify = async (req, res, next) => {
    try {
        const { number, otp } = req.body
        const OTPVerify = await OTP.verify(number, otp)
        if (OTPVerify.valid) {
            const User = await db.get().collection("users").findOne({ number: number })
            const refreshtoken = jwt.sign({ _id:User._id, number: number }, process.env.REFRESH_TOKEN_SECRET)
            const accesstoken = jwt.sign({ number ,name:User.name,}, process.env.ACCESS_TOKEN_SECRET)
            User.refreshtoken = refreshtoken
            res.cookie("refreshToken", refreshtoken, { httpOnly: false, maxAge: 604800000 });
            res.json({ success: true, message: "otp verified successfully", accesstoken });
            return
        }
        res.json({ success: false, message: "otp is wrong" });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    login,
    verify,
}



