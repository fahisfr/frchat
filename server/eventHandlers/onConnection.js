const dbUser = require("../dbSChemas/user");

const clients = [];

module.exports = async (socket) => {
  const { _id, number } = socket.user;
  console.log(`${number} Conected`);
  clients.push(socket);
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

  socket.on("send-message", async ({ to, text }) => {
    const client = clients.find((client) => client.user.number === to);

    const messsage = { from: number, to, text, date: new Date() };

    if (client) {
      client.emit("recieve-message", messsage);
    }
  });

  socket.on("disconnect", () => {
    console.log(`${number} Discoected`);
    const userIndex = clients.findIndex((user) => user === socket);
    clients.splice(userIndex, 1);
  });
};
