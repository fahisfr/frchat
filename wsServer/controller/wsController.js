

const ContactsInfo = (clients, userWs) => {
    
    console.log(userWs._user.number, "Connected")
    userWs._user.contacts?.map(contact => {
        contact.messages = []
        clients.find(client => {
            if (client._user.number == contact.number) {
                contact.online = true
                client.send(JSON.stringify({
                    event: "user_online_status",
                    status: true,
                    number: userWs._user.number
                }))
                return contact
            }
            return contact
        })
    })
    userWs.send(JSON.stringify({
        event: "contactsinfo",
        contacts: userWs._user.contacts,
        date: new Date()
    }))
}

const sendMessage = (clients, message) => {
    const user = clients.find(user => user._user.number == message.to)
    user?.send(JSON.stringify(
        {
            event: "message",
            from: message.from,
            message: message.message,
        }
    ))
}


const userOfline = (clients, userWs) => {
    userWs._user.contacts?.forEach(res => {
        clients.find(x => {
            if (x._user.number == res.number) {
                x.send(JSON.stringify({
                    event: "user_online_status",
                    status: false,
                    number: userWs._user.number
                }))
            }

        })
    });
}

module.exports = {
    userOfline,
    sendMessage,
    ContactsInfo,
   
}