const db = require("../Config/DBconn");

const AddContact = async (req, res, next) => {
    try {
        const UserNumber = req.user.number;
        const { number: ContactNumber, name } = req.body;
        const User = await db.get().collection("users").findOne({ number: parseInt(ContactNumber) });
        if (!User) return res.json({ success: false, message: "user not found" });
        const Contact = await db.get().collection("users").findOne({ number: parseInt(UserNumber) });
        console.log(Contact)
        const AlReadyExist = Contact?.contacts.find(contact => contact.number === ContactNumber);
        if (AlReadyExist) return res.json({ success: false, message: "contact already exists" });
        db.get().collection("users").updateOne({ number: parseInt(UserNumber) }, {
            $push: {
                contacts: {
                    id: User._id,
                    number: ContactNumber, name

                }
            }
        }).then(() => res.json({ success: true, message: "contact added successfully" }))
          .catch(err => res.json({ success: false, message: "failed to add contact" }))

    } catch (error) {
        next(error);
    }

}

const RemoveContact = (req, res, next) => {
    try {
        const { number, name } = req.body;
        db.get().collection("users").updateOne({ number }, {
            $pull: {
                contacts: {
                    name, number,
                }
            }
        })
            .then(() => res.json({ success: true, message: "contact deleted successfully" }))
            .catch(err => res.json({ success: false, message: "something went wrong" }))
    } catch (error) {
        next(error);
    }
}

module.exports = {
    AddContact,
    RemoveContact
}