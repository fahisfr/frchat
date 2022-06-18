const redisClient = require("../config/redis")

const sendMessage = ({ to, from, message }, clients) => {

    try {
        const client = clients.find(clinet => clinet._user.number === to)

        if (client) {
            client.send(JSON.stringify({
                event: "message",
                data: { from, message }
            }))
        }

        redisClient.rPush(`${from}_messages`, JSON.stringify({ from: to, message: { ...message, from: "me" } }))
        redisClient.rPush(`${to}_messages`, JSON.stringify({ from, message }))

    } catch (err) {
        console.log(err)
    }
}

const typing = ({ from, status, to }, clients) => {

    const client = clients.find(client => client._user.number === to)

    if (client) {
        client.send(JSON.stringify({
            event: "typing",
            data: { from, status }
        }))

    }

}


module.exports = {
    sendMessage,
    typing
}