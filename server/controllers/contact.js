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
      console.log(addNewContact)
    if (!addNewContact) {
      return res.json({ status: "error", error: "" });
    }
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addContact };
