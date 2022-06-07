const redisClient = require("../config/redis")

const sendMessage = ({to,from,message}, clients) => {

    try {
        const client = clients.find(clinet => clinet._user.number === to)

        client?.send(JSON.stringify({
            event: "message",
            data: { from,message}
        }))
    
        redisClient.rPush(`messages_${from}`, JSON.stringify({ from:to, message: { ...message, from: "me" } }))
        redisClient.rPush(`messages_${to}`, JSON.stringify({ from, message }))
        
    } catch (err) {
        console.log(err)
    }
}

const typing = ({from,status,to}, clients) => {

    const ws = clients.find(client => client._user.number ===to)

    ws?.send(JSON.stringify({
        event: "typing",
        data: {from,status}
    }))
}


module.exports = {
    sendMessage,
    typing
}