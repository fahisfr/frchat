require('dotenv').config();
const http = require('http')
const WebSocket = require('ws')
const jwt = require("jsonwebtoken")
const dbconn = require('./dbConn')
const getUserInfo = require('./controller/GetUserInfo');
const server = http.createServer(function (req, res) { })
const wsController = require('./controller/wsController')

dbconn.connect(() => {
    server.listen(4000, () => {
        console.log('server is running on port 4000')
    })
})
const wss = new WebSocket.Server({
    noServer: true
})

const clients = []


wss.on("connection", (client) => {
    clients.push(client)
    wsController.ContactsInfo(clients, client)

    client.on("message", (message) => {
        const { event, data } = JSON.parse(message)
        switch (event) {
            case "message":
                wsController.sendMessage(clients, data)
                break;
            case "typing":
                wsController.typing(clients, data)
                break
            
            
        }
    })

    client.on("close", (ws) => {
        clients.splice(clients.indexOf(client), 1)
        wsController.userOfline(clients, client)

    })

})

server.on('upgrade', function upgrade(request, socket, head) {
    const auccesstoken = request.url.split('=')[1]

    jwt.verify(auccesstoken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return socket.end('Unauthorized')

        getUserInfo(decoded).then(result => {
            if (result.length == 0) {
                wss.handleUpgrade(request, socket, head, function done(ws) {
                    ws._user = decoded
                    wss.emit('connection', ws, request)
                })

            }
            wss.handleUpgrade(request, socket, head, function done(ws) {
                ws._user = result
                wss.emit('connection', ws, request)

            })

        }).catch(err => socket.end('oops something went wrong'))

    })

});



