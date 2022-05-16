const db = require("../config/dbConn");

const AddContact = async (req, res, next) => {
    try {
        const UserNumber = req.user.number
        const { number: ContactNumber, name } = req.body;
        console.log(UserNumber, ContactNumber)
        if (ContactNumber === UserNumber) return res.json({ success: false, message: "you can't add yourself" })
        const User = await db.get().collection("users").findOne({ number: ContactNumber });
        if (!User) return res.json({ success: false, message: "user not found" });
        const Contact = await db.get().collection("users").findOne({ number: UserNumber });
        const AlReadyExist = Contact?.contacts.find(contact => contact.number === ContactNumber);
        if (AlReadyExist) return res.json({ success: false, message: "contact already exists" });
        const { value: { _id, ...contactInfo } } = await db.get().collection("users").findOneAndUpdate({ number: UserNumber }, {
            $push: {
                contacts: {
                    id: User._id,
                    name: name,
                    number: ContactNumber

                }
            }
        })

        res.json({ success: true, contact: contactInfo, message: "contact added successfully" })

    } catch (error) {
        next(error);
    }

}

const RemoveContact = async (req, res, next) => {
    try {
        const { number } = req.body;
        await db.get().collection("users").updateOne({ number:req.user.number }, {
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