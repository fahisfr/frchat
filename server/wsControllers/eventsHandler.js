const getUserInfo = require("../controllers/getUserInfo");
const clients = new Map();

module.exports = async (socket) => {
  try {
    const { _id, number, contacts } = socket.user;
    clients.set(number, socket);
    const userInfo = await handleUserOnconnect(_id, number);

    socket.user.contacts = userInfo.contacts;
    socket.emit("on-connect", { userInfo });

    socket.on("send-message", async ({ to, text }) => {
      const message = { from: number, text, date: new Date() };
      socketEmit("recieve-message", to, message);
    });

    socket.on("user-start-typing-message", ({ to }) => {
      socketEmit("contact-start-typing-message", to, { from: number });
    });

    socket.on("user-stop-typing-message", ({ to }) => {
      socketEmit("contact-stop-typing-message", to, { from: number });
    });

    socket.on("disconnect", () => handleUserDisconnect(contacts, number));
  } catch (error) {
    console.log(error);
  }
};
const handleUserOnconnect = async (id, number) => {
  const userInfoDb = await getUserInfo(id);
  console.log(`${number} Conected`);
  const userInfo = userInfoDb[0];

  if (userInfo.contacts.length > 0) {
    userInfo.contacts?.map((contact) => {
      const client = clients.get(contact.number);
      if (client) {
        client.emit("contact-online", number);
        contact.onlineStatus = true;
      } else {
        contact.onlineStatus = false;
      }
      return contact;
    });
  }

  return userInfo;
};

const handleUserDisconnect = (contacts, number) => {
  console.log(`${number} Discoected`);
  contacts?.forEach((contact) => {
    socketEmit("contact-offline", contact.number, number);
  });
  clients.delete(number);
};
const socketEmit = (emitName, to, data) => {
  const client = clients.get(to);
  if (client) {
    client.emit(emitName, data);
  }
};
