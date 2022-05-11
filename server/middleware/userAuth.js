const ApiError = require("../config/apiErrors");
const jwt = require("jsonwebtoken");

IsAuth = (req, res, next) => {
    try {
        const auccessToken = req.headers.authorization?.split(" ")[1]
        if (!auccessToken) return next(ApiError.Unauthorized("unauthorized"));
        jwt.verify(auccessToken, process.env.ACCESS_TOKEN_SECRET, async (err, result) => {
            if (err) return next(ApiError.Forbidden());
            req.user = result;
            next();
        });
    } catch (error) {
        next(error);
    }
}
module.exports = IsAuth;