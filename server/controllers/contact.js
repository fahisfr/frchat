const dbUser = require("../dbSChemas/user");

const addContact = async (req, res, next) => {
  try {
    const {
      body: { name, number },
      user: { id },
    } = req;

    const user = await dbUser.findOne({ number });
    if (!user) {
      return res.json({
        status: "error",
        message: "Invalid contact number, please check and try again",
      });
    }
    const addNewContact = await dbUser.updateOne(
      { _id: id },
      {
        $addToSet: {
          contacts: {
            name,
            number,
          },
        },
      }
    );

    if (addNewContact.modifiedCount > 0) {
      return res.json({
        status: "ok",
        contact: {
          name,
          number,
          profile: user.profile,
          messages: [],
        },
      });
    }
    res.json({ status: "error", message: "Failed to add new contact" });
  } catch (error) {
    next(error);
  }
};

const changeName = async (req, res, next) => {
  try {
    const {
      body: { name, number },
      user: { id },
    } = req;
    const dbRes = await dbUser.updateOne(
      { _id: id },
      {
        $set: {
          "contacts.$[ind].name": name,
        },
      },
      {
        arrayFilters: [{ "ind.number": number }],
      }
    );

    if (dbRes.modifiedCount > 0) {
      return res.json({ status: "ok", message: "Contact name changed" });
    }
    res.json({ status: "error", message: "Failed to change contact name" });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const {
      user: { id },
      body: { number },
    } = req;
    const dbRes = await dbUser.updateOne(
      { _id: id },
      {
        $pull: {
          contacts: {
            number,
          },
        },
      }
    );
    if (dbRes.modifiedCount > 0) {
      return res.json({ status: "ok", message: "contact removed" });
    }
    res.json({ status: "error", message: "Failed to remove contact" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addContact, changeName, removeContact };
