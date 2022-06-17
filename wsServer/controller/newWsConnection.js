const redisClient = require("../config/redis")
const getUserInfo = require("./GetUserInfo")


const newWsConnection = async (ws, clients) => {
    try {

        const { number } = ws._user
        clients = Array.from(clients)
  
        const oldMessages = await redisClient.lRange(`messages_${number}`, 0, -1)

        const userInfo = await getUserInfo(number)

        for (let wsInd = 0; wsInd < clients.length; wsInd++) {

            for (contact of userInfo.contacts) {
                const client = clients[wsInd]

                if (client._user.number === contact.number) {
                    contact.online = true
                    client.send(JSON.stringify({
                        event: "onlineStatus",
                        data: { number, status: true }
                    }))
                    break;
                }
            }
        }

        ws.send(JSON.stringify({
            event: "userInfo",
            data: {userInfo, oldMessages}
        }))

        userInfo.contacts.map(contact => contact.messages = [])
        return [null, userInfo]

    } catch (err) {
        return [err, null]
    }
}






module.exports = newWsConnection