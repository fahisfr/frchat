const jwt = require("jsonwebtoken");
const dbUser = require("../dbSChemas/user");

module.exports = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          next(new Error("403"));
        } else {
          next(new Error("401"));
        }
      }
      const userInfo = await dbUser.findOne({ _id: user?.id });
      if (!userInfo) {
        next(new Error("401"));
      }

      socket.user = userInfo;
      next();
    });
  } else {
    next(new Error("401"));
  }
};
