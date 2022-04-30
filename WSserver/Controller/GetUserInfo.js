const { get } = require("../DBconn")
const db =require("../DBconn")

const getUserInfo = (user) => {
    return new Promise((resolve, reject) => {
        db.get().collection("users").aggregate([
            {
                $match: { number:parseInt(user.number) }
            },
            { $unwind: "$contacts" },

            {
                $lookup: {
                    from: "users",
                    localField: "contacts.id",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $group: {
                    _id: null,
                    number: { $first: "$number" },
                    name: { $first: "$name" },
                    contacts: { $push: "$result" },
                }
            },
        ]).toArray()
            .then(result => {
                if (result.length == 0) {
                    resolve(result)
                    return
                }
                result[0].contacts = result[0].contacts.map(contact => contact[0])
                resolve(result[0])
            })
           .catch(err => reject(err))
     })
    
}
module.exports=getUserInfo