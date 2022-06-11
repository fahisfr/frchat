const redisClient = require("../config/redis")


const newWsConnection = async (ws, clients) => {

    try {
        const user = ws._user
        const userMessages = await redisClient.lRange(`messages_${user.number}`, 0, -1)

        for (let wsInd = 0; wsInd < clients.length; wsInd++) {

            for (let conInd = 0; conInd < user.contacts.length; conInd++) {
                const client = clients[wsInd]
                if (client._user.number === user.contacts[conInd].number) {
                    user.contacts[conInd].online = true
                    client.send(JSON.stringify({
                        event: "onlineStatus",
                        data: { status: true, number: user.number }
                    }))
                    break;
                }
            }
        }

        ws.send(JSON.stringify({
            event: "userInfo",
            data: {
                userInfo: user,
                messages: userMessages,
            }
        }))

        ws._user.contacts.map(contact => contact.messages = [])
        return [null,ws]

    } catch (err) {
        return [err, null]
    }
}






module.exports = newWsConnection