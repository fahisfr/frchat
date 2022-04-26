
const db = require("../Config/DBconn");
const OTP = require("./Otp")

const login = async (req, res, next) => {
    try {
        const { number } = req.body;
        const client = await db.get().collection("users").findOne({ number  })
        if (!client) return res.json({ success: false, message: "number  was wrong" });
        res.json({ success: true, message: "otp send successfully" })
    } catch (error) {
        next(error);
    }
}

const verify = async (req, res, next) => {
    try {
        const { number, otp } = req.body
        const OTPVerify = await OTP.verify(number, otp)
        if (OTPVerify.valid) {
            const refreshtoken = Jwt.sign({ _id: createNewUser._id, number: createNewUser.number }, process.env.REFRESH_TOKEN_SECRET)
            const auccesstoken = Jwt.sign({ number }, process.env.ACCESS_TOKEN_SECRET)
            const User = await db.get().collection("users").findOne({ number: number })
            User.refreshtoken = refreshtoken
            res.cookie("refreshToken", refreshtoken, { httpOnly: false, maxAge: 604800000 });
            res.json({ success: true, message: "otp verified successfully", auccesstoken });
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



