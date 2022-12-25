const jwt = require("jsonwebtoken");
const dbUser = require("../dbSChemas/user");
module.exports = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        next(new Error("token not vaild"));
      }
      const userInfo = await dbUser.findOne({ _id: user?.id });
      if (!userInfo) {
        next(new Error("user not found"));
      }
      
      socket.user = userInfo;
      next();
    });
  } else {
    next(new Error("token not found"));
  }
};
