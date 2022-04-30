require('dotenv').config();
const http = require('http')
const WebSocket = require('ws')
const jwt = require("jsonwebtoken")
const dbconn = require('./DBconn')
const getUserInfo = require('./Controller/GetUserInfo');
const server = http.createServer(function (req, res) { })

dbconn.connect(() => {
    server.listen(4000, () => {
        console.log('server is running on port 4000')
    })
})

const AllClients = []

const UserOfline = (UserWs) => {
    UserWs._user.contacts?.forEach(res => {
        AllClients.find(x => {
            if (x._user.number == res.number) {
                x.send(JSON.stringify({
                    event: "user_online_status",
                    status: false,
                    number: UserWs._user.number
                }))
                return
            }
            return
        })
    });
}

const SendContactsInfo = async (UserWs) => {
    AllClients.push(UserWs)
    console.log(UserWs._user.number,"Connected")
    UserWs._user.contacts?.map(contact => {
        contact.messages = []
        AllClients.find(client => {
            if (client._user.number == contact.number) {
                contact.online = true
                client.send(JSON.stringify({
                    event: "user_online_status",
                    status: true,
                    number: UserWs._user.number
                }))
                return contact
            }
            return contact
        })
    })
    UserWs.send(JSON.stringify({
        event: "contactsinfo",
        contacts: UserWs._user.contacts,
        date: new Date()
    }))
}


const wss = new WebSocket.Server({
    noServer: true
})

wss.on("connection",  (client) => {
    SendContactsInfo(client)
    client.on("message",  (message) => {
        var data = JSON.parse(message)
        const user = AllClients.find(user => user._user.number == data.to)
        user?.send(JSON.stringify(
            {
                event: "message",
                from: data.from,
                message: data.message,
            }
        ))
    })
    client.on("close",  (ws) => {
        AllClients.splice(AllClients.indexOf(client), 1)
        UserOfline(client)
        console.log("disconnected")
    })
})

server.on('upgrade',  function upgrade(request, socket, head) {

    const auccesstoken = request.url.split('=')[1]

    jwt.verify(auccesstoken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return socket.end('Unauthorized')
        getUserInfo(decoded).then(result => {
            if (result.length == 0) {
                wss.handleUpgrade(request, socket, head, function done(ws) {
                    ws._user = decoded
                    wss.emit('connection', ws, request)
                })
                return
            }
            wss.handleUpgrade(request, socket, head, function done(ws) {
                ws._user = result
                wss.emit('connection', ws, request)

            })
        })



    })
});



