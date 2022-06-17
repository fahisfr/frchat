
const redisClient = require("../../wsServer/config/redis");
const db = require("../config/dbConn");

const addContact = async (req, res, next) => {
    try {

        const userNumber = req.user.number
        const { number: contactNumber, name } = req.body;

        if (contactNumber === userNumber) return res.json({ success: false, message: "you can't add yourself" })
        const userAndConInfo = await db.get().collection("users").find(
            { number: { $in: [userNumber, contactNumber] } }).toArray();

        if (userAndConInfo.length !== 2) return res.json({ success: false, message: "number doesn't exist" })
        const conAlredyExist = userAndConInfo[0].contacts?.find(contact => contact.number === contactNumber)
        if (conAlredyExist) return res.json({ success: false, message: "number already saved?" })

        db.get().collection("users").updateOne({ number: userNumber }, {
            $push: {
                contacts: {
                    number: contactNumber,
                    name,
                    messages: []
                }
            }
        })
            .then(result => {
                res.json({
                    success: true, contact: {
                        name,
                        photo: userAndConInfo[1].photo,
                        number: contactNumber,
                    }, message: "contact added successfully"
                })
            })
            .catch(error => res.json({ success: false, message: "faild to add contact" }))


    } catch (error) {
        next(error);
    }

}

const removeContact = async (req, res, next) => {
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

const updateContact = async (req, res, next) => {

    const { number, name } = req.body;

    db.get().collection("users").updateOne({ number: req.user.number }, {
        $set: {
            "contacts.$[elem].name": name
        }
    },
        {
            arrayFilters: [{ "elem.number": number }]
        })
        .then(result => res.json({ success: true, message: "contact name changed successfully" }))
        .catch(error => res.status(500).json({ success: false, message: "faild to change contact name" }))


}

module.exports = {
    addContact,
    removeContact,
    updateContact
}