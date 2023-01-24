const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).json({ status: "error", error: "unauthorized" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ status: "error", error: " Invalid token" });

    req.user = decoded;

    next();
  });
};
