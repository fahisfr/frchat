const dbUser = require("../dbSChemas/user");
const db = require("mongoose").Types.ObjectId;
module.exports = async (socket) => {
  const { _id, number } = socket.user;
  console.log(`${number} conected`);

  const userInfo = await dbUser.aggregate([
    {
      $match: {
        _id,
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$contacts",
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "number",
        localField: "contacts.number",
        as: "contactInfo",
      },
    },
    {
      $project: {
        number: 1,
        profile: 1,
        messages: 1,
        contacts: {
          name: 1,
          number: 1,
          profile: {
            $arrayElemAt: ["$contactInfo.profile", 0],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        number: { $first: "$number" },
        profile: { $first: "$profile" },
        contacts: {
          $push: "$contacts",
        },
      },
    },
  ]);


  socket.emit("on-connect", { userInfo: userInfo[0] });

  socket.on("disconnect", () => {
    console.log("User Disconnect");
  });
};
