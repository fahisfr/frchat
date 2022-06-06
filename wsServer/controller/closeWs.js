const db = require("../config/dbConn")
const redisClient = require("../config/redis")

const closeWs = async ({ number, contacts }, clients) => {

    try {

        for (let wsInd = 0; wsInd < clients.length; wsInd++) {
            const client = clients[wsInd]

            for (let conInd = 0; conInd < contacts.length; conInd++) {
                if (client._user.number === contacts[conInd].number) {
                    client.send(JSON.stringify({
                        event: "onlineStatus",
                        data: {
                            status: false,
                            number
                        }
                    }))
                    contacts.splice(conInd, 1)
                    break;
                }

            }
        }
        // const messages = await redisClient.lRange(`messages_${number}`, 0, -1)
    // const unSavedCon = []
    // const conNumbers = ws._user.contacts.map(contact => contact.number)
    // if (messages.length > 0) {
    //     for (const { from, message } of messages) {
    //         let conIn = false

    //         for (const { number, messages } of ws._user.contacts) {
    //             if (number === from) {
    //                 messages.push(message)
    //                 conIn = true
    //                 break
    //             }
    //         }
    //         !conIn && unSavedCon.push({
    //             number: from,
    //             messages: [message]
    //         })
    //     }


    //     db.get().collection('users').updateOne({
    //         number: ws._user.number
    //     },
    //         [
    //             {
    //                 $set: {
    //                     contacts: {
    //                         $map: {
    //                             input: "$contacts",
    //                             as: "contact",
    //                             in: {
    //                                 $cond: [
    //                                     { $in: ["$$contact.number", conNumbers] },
    //                                     {


    //                                         $mergeObjects: [
    //                                             "$$contact", {
    //                                                 messages: {
    //                                                     $concatArrays: [
    //                                                         "$$contact.messages",
        
        

    //                                                     ]
    //                                                 }
    //                                             }
    //                                         ]
    //                                     },
    //                                     "$$contact"

    //                                 ]
    //                             }

    //                         }
    //                     }
    //                 }
    //             }
    //         ]

    //     )

    // }
    } catch (err) {
        console.log(err)
    }





    
}

module.exports = closeWs