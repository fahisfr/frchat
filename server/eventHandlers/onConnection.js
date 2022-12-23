const dbUser = require("../dbSChemas/user");
const db = require("mongoose").Types.ObjectId;
module.exports = async (socket) => {
  console.log("user con");

  socket.emit("on-connect", { userInfo: userInfo[0] });

  socket.on("disconnect", () => {
    console.log("User Disconnect");
  });
};
