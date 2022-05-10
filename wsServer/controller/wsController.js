

const ContactsInfo = (clients, userWs) => {

    console.log(userWs._user.number, "Connected")

    userWs._user.contacts?.map(contact => {
        contact.messages = []
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
        event: "contactsInfo",
        data: {
            contacts: userWs._user.contacts,
            date: new Date()
        }

    }))
}

const sendMessage = (clients, data) => {
    const client = clients.find(clinet => clinet._user.number == data.to)
    if (client) {
        client.send(JSON.stringify({
            event: "message",
            data: {
                from: data.from,
                message: data.message,
            }
        }))
    } else {
        
    }

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
    const contacts = userWs._user.contacts

    for (let contact of contacts) {
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
    };
    console.log(userWs._user.number, "Disconnected")
}

module.exports = {
    userOfline,
    sendMessage,
    ContactsInfo,
    typing

}