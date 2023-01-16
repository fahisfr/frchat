const dbUser = require("../dbSChemas/user");
const clients = new Map();

module.exports = async (socket) => {
  try {
    const { _id, number, contacts } = socket.user;
    console.log(`${number} Conected`);
    clients.set(number, socket);

    const userInfoFromDb = await dbUser.aggregate([
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

    const userInfo = userInfoFromDb[0];

    if (userInfo.contacts.length > 0) {
      userInfo.contacts?.map((contact) => {
        const client = clients.get(contact.number);
        if (client) {
          client.emit("user-online", number);
          contact.onlineStatus = true;
        } else {
          contact.onlineStatus = false;
        }
        return contact;
      });
    }

    socket.user.contacts = userInfo.contacts;

    socket.emit("on-connect", { userInfo });

    socket.on("send-message", async ({ to, text }) => {
      const client = clients.get(to);

      const messsage = { from: number, to, text, date: new Date() };

      if (client) {
        client.emit("recieve-message", messsage);
      }
    });

    socket.on("disconnect", () => {
      console.log(`${number} Discoected`);
      contacts?.forEach((con) => {
        const contact = clients.get(con.number);
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
