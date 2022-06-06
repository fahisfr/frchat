const redisClient = require("../config/redis")

const sendMessage = (data, clients) => {

    try {
        const client = clients.find(clinet => clinet._user.number === data.to)

        client?.send(JSON.stringify({
            event: "message",
            data: { from: data.from, message: data.message, }
        }))

    
        redisClient.rPush(`messages_${data.from}`, JSON.stringify({ from: data.to, message: { ...data.message, from: "me" }, }))
        redisClient.rPush(`messages_${data.to}`, JSON.stringify({ from: data.from, message: { ...data.message, }, }))
    } catch (err) {
        console.log(err)
    }
}

const typing = (data, clients) => {

    const ws = clients.find(client => client._user.number == data.to)

    ws?.send(JSON.stringify({
        event: "typing",
        data: {
            from: data.from,
            status: data.status
        }
    }))
}


module.exports = {
    sendMessage,
    typing
}