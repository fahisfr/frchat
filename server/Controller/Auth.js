const db = require("../Config/DBconn");
const jwt = require("jsonwebtoken");

const Authentication = (req, res, next) => {
    try {
        const auccesstoken = req.headers["authorization"];
        if (!auccesstoken) return res.json({ success: false, message: "authorization token is required" });
        const decoded = jwt.verify(auccesstoken, process.env.ACCESS_TOKEN_SECRET, async (err, result) => {
            if (err) return res.json({ success: false, message: "authorization token is invalid" });
            const {_id,...userInfo} = await db.get().collection("users").findOne({ number: parseInt(result.number) });
            res.json({
                success: true,
                UserInfo: {
                    ...userInfo,
                    isAuth: true,
                }
            });
        });

    } catch (error) {
        next(error);
    }
}

const Re_Authentication = async (req, res, next) => {
    try {
        const cookie = req.cookie
        if (!cookie?.refreshtoken) return res.json({ success: false, message: "refresh token is required" });
        const User = await db.get().collection("users").findOne({ _id: cookie._id, refreshtoken: cookie.refreshtoken });
        if (!User) return res.json({ success: false, message: "refresh token is invalid" });
        const auccesstoken = jwt.sign({ _id: User._id, number: User.number }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ success: true, message: "auth successfully", auccesstoken: auccesstoken });

    } catch (error) {
        next(error);
    }

}

module.exports = {
    Authentication,
    Re_Authentication
}