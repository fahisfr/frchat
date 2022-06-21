
const redisClient = require('../config/redis')
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

        if (conAlredyExist) {
            
            if (!conAlredyExist.name) {
                db.get().collection("users").updateOne({ number: userNumber }, {
                    $set: {
                        "contacts.$[index].name": name
                    }
                },
                    {
                        arrayFilters: [{ "index.number": contactNumber }]
                    }
                )

                return res.json({
                    success: true,
                    contact: {
                        name,
                        number: contactNumber,
                        photo: userAndConInfo[1].photo
                    },
                    message: "contact added successfully"
                })
                
            }
            return res.json({ success: false, message: "contact already saved" })
        }

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
                    },
                    message: "contact added successfully"
                })
            })
            .catch(error => res.json({ success: false, message: "faild to add contact" }))

    } catch (error) {
        next(error);
    }

}

const removeContact = async (req, res, next) => {
    try {
        const { body: { number: conNumber, saved }, user: { number } } = req

        const removeConMessages = async (messages) => {
            //remove contacat messages from redis (crash)
            const filterMessages = messages.filter(message => JSON.parse(message).from !== conNumber)
            await redisClient.del(`${number}_messages`)
            filterMessages.length > 0 && redisClient.rPush(`${number}_messages`, ...filterMessages)

        }

        if (saved) {
            const removeCon = await Promise.all([
                db.get().collection("users").updateOne({ number }, {
                    $pull: {
                        contacts: {
                            number: conNumber
                        }
                    }
                }),
                redisClient.lRange(`${number}_messages`, 0, -1)

            ])

            if (removeCon[0].modifiedCount === 0) return res.json({ success: false, message: "contact not found" })
            removeCon[1].length > 0 &&  removeConMessages(removeCon[1])

        } else {

            const userMessages = await redisClient.lRange(`${number}_messages`, 0, -1)
            userMessages.length > 0 && removeConMessages(userMessages)

        }

        res.json({ success: true, message: "contact removed successfully" })

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