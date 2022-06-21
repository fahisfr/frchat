const db = require("../config/dbConn")
const redisClient = require("../config/redis")


const closeWs = async (ws, clients) => {

    try {

        clients = Array.from(clients)
        const { number, contacts } = ws._user
        
        //send offline status to all user contacts
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
       
        const newMessages = await redisClient.lRange(`${number}_messages`, 0, -1)
       
        if (newMessages.length > 0) {

            for (const mes of newMessages) {
                let conIn = false
                const { message, from } = JSON.parse(mes)

                for (const { number, messages } of contacts) {

                    if (number === from) {
                        messages.push(message)
                        conIn = true
                        break
                    }
                }

                !conIn && contacts.push({
                    number: from,
                    messages: [message]
                })
            }

         //save newmessages to db
          db.get().collection('users').updateOne(
            {
                number
            },
                [
                    {
                        $set: {
                            contacts: {
                                $let:{
                                    vars:{
                                        consNumberArray:{
                                            $map:{
                                                input:"$contacts",
                                                as:"con1",
                                                in:"$$con1.number"
                                            }
                                        }
                                    },
                                    in:{
                                        $concatArrays: [
                                            {
                                                $map: {
                                                    input: "$contacts",
                                                    as: "contact",
                                                    in: {
                                                        $cond: [
                                                            { $in: ["$$contact.number", "$$consNumberArray"] },
                                                            {
                                                                $mergeObjects: [
                                                                    "$$contact", {
                                                                        messages:
                                                                        {
                                                                            $let: {
                                                                                vars: {
                                                                                    filltercon: {
                                                                                        $filter: {
                                                                                            input: contacts,
                                                                                            as: "con",
                                                                                            cond: { $eq: ["$$con.number", "$$contact.number"] }
        
                                                                                        }
        
                                                                                    },
        
                                                                                },
                                                                                in: {
                                                                                    $concatArrays: [ 
                                                                                        "$$contact.messages",
                                                                                        {
                                                                                            $arrayElemAt: [
                                                                                                "$$filltercon.messages", 0
                                                                                            ]
                                                                                        }
        
                                                                                    ]
                                                                                }
        
                                                                            }
                                                                        }
        
        
                                                                    }
                                                                ]
                                                            },
                                                            "$$contact"
        
                                                        ]
                                                 
                                                }
                                            }
                                            
                                        },
                                        {
                                            $filter: {
                                                input:contacts,
                                                as: "ns_con",
                                                cond: {
                                                    $not: {
                                                        $in: ["$$ns_con.number", "$$consNumberArray"]
                                                   }
                                                }
                                            }
                                                
                                        }
                                                     
                                       ]
                                    }
                                }
                            }
                        }
                    }
                ]

          ).then(() => redisClient.del(`${number}_messages`)).catch(err => console.log(err))
        }
    } catch (err) {
        console.log(err.message)
    }






}

module.exports = closeWs