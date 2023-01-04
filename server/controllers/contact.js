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
    console.log(addNewContact);
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
    const dbRes = dbUser({ _id: req.user.id });
  } catch (error) {}
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

module.exports = { addContact };
