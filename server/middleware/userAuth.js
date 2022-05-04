const ApiError = require("../config/apiErrors");
const jwt = require("jsonwebtoken");

 IsAuth = (req, res, next) => {
    try {
        const accesstoken = req.headers["authorization"];
        if (!accesstoken) return next(ApiError.Unauthorized());
        const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET, async (err, result) => {
            if (err) return next(ApiError.Forbidden());
            req.user = result;
            next();
        });
    } catch (error) {
        next(error);
    }
 }
module.exports = IsAuth;