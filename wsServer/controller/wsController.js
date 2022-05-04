

const ContactsInfo = (clients, userWs) => {

    console.log(userWs._user.number, "Connected")
    userWs._user.contacts?.map(contact => {
        contact.messages = []
        clients.find(client => {
            if (client._user.number == contact.number) {
                contact.online = true
                client.send(JSON.stringify({
                    event: "user_online_status",
                    data: {
                        status: true,
                        number: userWs._user.number
                    }
                }))
                return contact
            }
            return contact
        })
    })
    userWs.send(JSON.stringify({
        event: "contactsinfo",
        data: {
            contacts: userWs._user.contacts,
            date: new Date()
        }

    }))
}

const sendMessage = (clients, data) => {
    
    const user = clients.find(user => user._user.number == data.to)

    user?.send(JSON.stringify({
        event: "message",
        data: {
            from: data.from,
            message: data.message,
        }
    }))
}

const typing = (clients, data) => {
    const user = clients.find(user => user._user.number == data.to)

    user?.send(JSON.stringify({
        event: "typing",
        data: {
            from: data.from,
            status: data.status
        }
    }))
}


const userOfline = (clients, userWs) => {
    userWs._user.contacts?.forEach(res => {
        clients.find(x => {
            if (x._user.number == res.number) {
                x.send(JSON.stringify({
                    event: "user_online_status",
                    data: {
                    status: false,
                        number: userWs._user.number
                    }
                }))
            }

        })
    });
}

module.exports = {
    userOfline,
    sendMessage,
    ContactsInfo,
    typing

}