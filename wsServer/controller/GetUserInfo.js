
const db = require("../dbConn")

const getUserInfo = (user) => {
    return new Promise((resolve, reject) => {
        db.get().collection("users").aggregate([
            {
                $match: { number: parseInt(user.number) }
            },
            { $unwind: "$contacts" },

            {
                $lookup: {
                    from: "users",
                    localField: "contacts.id",
                    foreignField: "_id",
                    as: "_contacts"
                }
            },
            {
                $project: {
                    _id: 1,
                    number: 1,
                    name: 1,
                    _contacts: {
                        name: "$contacts.name",
                        photo: 1,
                        number: 1,
                        messages:"$contacts.messages"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    number: { $first: "$number" },
                    name: { $first: "$name" },
                    contacts: { $push: "$_contacts" },
                }
            },
        ]).toArray()
            .then(result => {
                if (result.length == 0) resolve(result)
                result[0].contacts = result[0].contacts.map(contact => contact[0])
                resolve(result[0])
            })
           .catch(err => reject(err))
     })
    
}
module.exports = getUserInfo