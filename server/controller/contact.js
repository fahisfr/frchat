
const db = require("../config/dbConn");

const AddContact = async (req, res, next) => {
    try {

        const userNumber = req.user.number
        const { number: contactNumber, name } = req.body;

        if (contactNumber === userNumber) return res.json({ success: false, message: "you can't add yourself" })
        const contactInfo = await db.get().collection("users").findOne({ number: contactNumber });
        if (!contactInfo) return res.json({ success: false, message: "user not found" });
        const user = await db.get().collection("users").findOne({ number: userNumber });
        const AlReadyExist = user?.contacts.find(contact => contact.number === contactNumber);
        if (AlReadyExist) return res.json({ success: false, message: "contact already exists" });
        db.get().collection("users").findOneAndUpdate({ number: userNumber }, {
            $push: {
                contacts: {
                    id: contactInfo._id,
                    name,
                    number: contactNumber,
                    messages: []

                }
            }
        }).then(result => res.json({success: true, contact: {name,photo: contactInfo.photo,number:contactNumber}, message: "contact added successfully"}))
          .catch(error => res.json({ success: false, messages: "failed to addcontact" }))

    } catch (error) {
        next(error);
    }

}

const RemoveContact = async (req, res, next) => {
    try {
        const { number } = req.body;
        await db.get().collection("users").updateOne({ number: req.user.number }, {
            $pull: {
                contacts: {
                    number
                }
            }
        })
            .then(result => { res.json({ success: true, message: "contact removed successfully" }) })
            .catch(error => res.status(500).json({ success: false, message: "faild to remove contact" }))


    } catch (error) {
        next(error);
    }
}

module.exports = {
    AddContact,
    RemoveContact
}