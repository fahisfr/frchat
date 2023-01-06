const dbUser = require("../dbSChemas/user");

const addContact = async (req, res, next) => {
  try {
    const {
      body: { name, number },
      user: { id },
    } = req;
    console.log(req.body);
    const user = await dbUser.findOne({ number });
    if (!user) {
      return res.json({ status: "error", error: "user not found" });
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

    if (!addNewContact) {
      return res.json({ status: "error", error: "" });
    }
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

const changeName = async (req, res, next) => {
  try {

    const dbRes = await dbUser.updateOne(
      { _id: req.user.id },
      {
        $set: {
          "contacts.$[ind].name": req.body.name,
        },
      },
      {
        arrayFilters: [{ "ind.number": req.body.number }],
      }
    );

    if (dbRes) {
      return res.json({ status: "ok", message: "Contact name changed" });
    }
    res.json({ status: "error" });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const dbRes = await dbUser.updateOne(
    { id: req.user.id },
    {
      $pull: {
        contact: req.body.number,
      },
    }
  );

  if (dbRes) {
    res.json({ status: "ok" });
  }
  res.json({ status: "error", error: "cann't remove contact" });
};

module.exports = { addContact, changeName };
