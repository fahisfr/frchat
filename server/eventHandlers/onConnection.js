const dbUser = require("../dbSChemas/user");

const clients = new Map();

module.exports = async (socket) => {
  try {
    const { _id, number, contacts } = socket.user;
    console.log(`${number} Conected`);
    clients.set(number, socket);

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
          about: 1,
          contacts: {
            name: 1,
            number: 1,
            messages: 1,
            about: { $arrayElemAt: ["$contactInfo.about", 0] },
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
          about: { $first: "$about" },
          contacts: {
            $push: "$contacts",
          },
        },
      },
    ]);

    userInfo[0].contacts?.map((contact) => {
      const client = clients.get(contact.number);
      if (client) {
        client.emit("user-online", number);
        contact.onlineStatus = true;
      } else {
        contact.onlineStatus = false;
      }
      return contact;
    });

    socket.user.contacts = userInfo[0].contacts;

    socket.emit("on-connect", { userInfo: userInfo[0] });

    socket.on("send-message", async ({ to, text }) => {
      const client = clients.get(to);

      const messsage = { from: number, to, text, date: new Date() };

      if (client) {
        client.emit("recieve-message", messsage);
      }
    });

    socket.on("disconnect", () => {
      console.log(`${number} Discoected`);

      contacts?.forEach(({ number }) => {
        const contact = clients.get(number);
        if (contact) {
          contact.emit("user-offline", number);
        }
      });
      clients.delete(number);
    });
  } catch (error) {
    console.log(error);
  }
};
