
const  redisClient= require ("../config/redis")
  

const ContactsInfo = async (clients, userWs) => {

    console.log(userWs._user.number, "Connected")
 
    const userMessages = await redisClient.lRange(`messages_${userWs._user.number}`, 0, -1)
    if (userMessages.length > 666) {
        redisClient.lTrim(`messages_${userWs._user.number}`, userMessages.length-666, -1) 
    }
    
    userWs._user.contacts?.map(contact => {
        clients.find(client => {
            if (client._user.number == contact.number) {
                contact.online = true
                client.send(JSON.stringify({
                    event: "onlineStatus",
                    data: {
                        status: true,
                        number: userWs._user.number
                    }
                }))
                return client
            }

        })
    })
    
    userWs.send(JSON.stringify({
        event: "userInfo",
        data: {
            userInfo: userWs._user,
            messages: userMessages,
        }

    }))

}

const sendMessage = (clients, data, user) => {
    const client = clients.find(clinet => clinet._user.number === data.to)

        client?.send(JSON.stringify({
            event: "message",
            data: { from: data.from, message: data.message, }
        }))
    redisClient.rPush(`messages_${user._user.number}`, JSON.stringify({ from: data.to, message: {...data.message,from:"me"}, }))
    redisClient.rPush(`messages_${data.to}`, JSON.stringify({ from: data.from, message: {...data.message,}, }))
}
const typing = (clients, data) => {
    const user = clients.find(client => client._user.number == data.to)

    user?.send(JSON.stringify({
        event: "typing",
        data: {
            from: data.from,
            status: data.status
        }
    }))
}


const userOfline = (clients, userWs) => {
    userWs._user?.contacts.forEach(contact=>{
        clients.find(client => {
            if (client._user.number == contact.number) {
                client.send(JSON.stringify({
                    event: "onlineStatus",
                    data: {
                        status: false,
                        number: userWs._user.number
                    }
                }))
            }

        })
    })
    console.log(userWs._user.number, "Disconnected")
}

module.exports = {
    userOfline,
    sendMessage,
    ContactsInfo,
    typing

}