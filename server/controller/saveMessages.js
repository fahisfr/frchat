const db = require("../config/dbConn")

const saveMessages = async (req, res, next) => {
    try {
        const { body: { message }, user: { number } } = req;
        const user = await db.get().collection("users").findOne({ number });

        user.contacts.forEach(contact => {
            newMessages.forEach(data => {
                if (contact.number == data.from) {
                    contact.messages.push(data.message)
                    return;
                }
            })
        })
        db.get().collection("users").updateOne({ number}, { $set: { contacts: user.contacts } }).then(result => {
            res.json({ success: true, message: "messages saved successfully" })
        })

    } catch (error) {
        next(error)
    }
}
module.exports = saveMessages