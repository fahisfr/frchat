
const db = require("../config/dbConn")

const getUserInfo = (number) => {
  
    return new Promise((resolve, reject) => {
        db.get().collection("users").aggregate([
            {
                $match: { number: parseInt(number) }
            },
            { 
                $unwind: {
                    path: "$contacts",
                    preserveNullAndEmptyArrays: true
                } 
            },

            {
                $lookup: {
                    from: "users",
                    localField: "contacts.number",
                    foreignField: "number",
                    as: "_contacts"
                }
            },
            {
                $project: {
                    _id: 1,
                    number: 1,
                    name: 1,
                    photo:1,
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
                    photo:{$first:"$photo"},
                    contacts: { $push: { $arrayElemAt: ["$_contacts", 0] } },
                }
            },
        ]).toArray()
            .then(result => resolve(result[0]))
            .catch(err => reject(err))
     })
    
}
module.exports = getUserInfo