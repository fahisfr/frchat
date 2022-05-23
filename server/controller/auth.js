const db = require("../config/dbConn");
const jwt = require("jsonwebtoken");
const apiErrors = require("../config/apiErrors");

const Authentication = (req, res, next) => {
    try {

        const auccesstoken = req.headers.authorization?.split(" ")[1]
        if (!auccesstoken) return res.json({ isAuth: false });
        
        jwt.verify(auccesstoken, process.env.ACCESS_TOKEN_SECRET, async (err, result) => {
            if (err) return res.status(403).json({ success: false, message: "invalid token " });
            res.json({ isAuth: true });
            
        });

    } catch (error) {
        next(error);
    }
}

const reAuthentication = async (req, res, next) => {
    try {
        const cookie = req.cookies.refreshToken
        if (!cookie) return next(apiErrors.unauthorized());
        jwt.verify(cookie, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
            if (!err) {
                const user = await db.get().collection("users").findOne({ number: result.number });
                if (!user) return next(apiErrors.Unauthorized());
                const accessToken = jwt.sign(
                    { number: result.number, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }
                );
                return res.json({success: true,accessToken, message: "", });
            }
            next(apiErrors.Unauthorized());
        })

    } catch (error) {
        next(error);
    }

}

module.exports = {
    Authentication,
    reAuthentication
}