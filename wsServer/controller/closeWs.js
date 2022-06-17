const db = require("../config/dbConn")
const redisClient = require("../config/redis")

const closeWs = async (ws, clients) => {

    try {

        clients = Array.from(clients)
        const { number, contacts } = ws._user

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

        const newMessages = await redisClient.lRange(`messages_${number}`, -1, 0)
        const conNumbers = ws._user.contacts.map(contact => contact.number)

        if (newMessages.length > 0) {
            
            for (const mes of newMessages) {
                let conIn = false
                const { message, from } = JSON.parse(mes)

                for (const { number, messages } of ws._user.contacts) {

                    if (number === from) {
                        messages.push(message)
                        conIn = true
                        break
                    }
                }

                !conIn && ws._user.contacts.push({
                    number: from,
                    notSaved: true,
                    messages: [message]
                })
            }

            //save newmessages to db

          db.get().collection('users').updateOne({
                number: ws._user.number
            },
                [
                    {
                        $set: {
                            contacts: {
                                $concatArrays: [
                                    {
                                        $map: {
                                            input: "$contacts",
                                            as: "contact",
                                            in: {
                                                $cond: [
                                                    { $in: ["$$contact.number", conNumbers] },
                                                    {
                                                        $mergeObjects: [
                                                            "$$contact", {
                                                                messages:
                                                                {
                                                                    $let: {
                                                                        vars: {
                                                                            filltercon: {
                                                                                $filter: {
                                                                                    input: ws._user.contacts,
                                                                                    as: "con",
                                                                                    cond: { $eq: ["$$con.number", "$$contact.number"] }

                                                                                }

                                                                            },

                                                                        },
                                                                        in: {
                                                                            $concatArrays: [
                                                                                {
                                                                                    $arrayElemAt: [
                                                                                        "$$filltercon.messages", 0
                                                                                    ]
                                                                                },
                                                                                "$$contact.messages"
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
                                            input: ws._user.contacts,
                                            as: "ns_con",
                                            cond: {
                                                $eq: ["$$ns_con.notSaved",true]
                                            }
                                        }
                                            
                                    }
                               ]
                            }
                        }
                    }
                ]

          ).then(() => redisClient.del(`messages_${number}`))
        }
    } catch (err) {
        console.log(err.message)
    }






}

module.exports = closeWs