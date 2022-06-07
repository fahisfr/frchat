const db = require("../config/dbConn");
const OTP = require("./otp")
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
   
    try {
        const { number } = req.body;
        const client = await db.get().collection("users").findOne({ number:number })
        if (!client) return res.json({ success: false, message: "number  was wrong" });

        OTP.create(number)
            .then(reulst => res.json({ success: true, message: "otp send successfully" }))
            .catch(error => { res.json({ success: false, message: "faild to send otp" }) })
        
    } catch (error) {
        next(error);
    }
}

const verify = async (req, res, next) => {
    
    try {
        const { number, otp } = req.body
        const { valid } = await OTP.verify(number, otp)
        
        if (valid) {
            const refreshtoken = jwt.sign({  number}, process.env.REFRESH_TOKEN_SECRET,{expiresIn: "30m"})
            const accesstoken = jwt.sign({ number }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "30d" })
            const User = await db.get().collection("users").updateOne({number},{$set:{refreshtoken}})
            res.cookie("refreshToken", refreshtoken, { httpOnly:false, secure:true, maxAge: 30 * 60 * 60 * 1000 });
            res.json({ success: true, message: "otp verified successfully", accesstoken});
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



