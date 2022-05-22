require('dotenv').config();
const http = require('http')
const WebSocket = require('ws')
const jwt = require("jsonwebtoken")
const dbconn = require('./config/dbConn')
const port = 4001
const getUserInfo = require('./controller/GetUserInfo');
const server = http.createServer(function (req, res) { })
const wsController = require('./controller/wsController')


dbconn.connect(() => server.listen(port, () => console.log(`server is running on port ${port}`)))

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
                wsController.sendMessage(clients, data, client)
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

    try {
        const auccesstoken = request.url.split('=')[1]
        if (!auccesstoken) return socket.destroy("unauthorized")

        jwt.verify(auccesstoken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) return socket.end('Unauthorized')
            const userInfo = await getUserInfo(decoded)
          
            if (userInfo.length > 0) {
                return wss.handleUpgrade(request, socket, head, function done(ws) {
                    ws._user = userInfo[0]
                    wss.emit('connection', ws, request)

                })
            }
            wss.handleUpgrade(request, socket, head, function done(ws) {
                ws._user = {
                    number: decoded.number,
                    contacts: []
                }
                wss.emit('connection', ws, request)
            })

        })


    } catch (error) {
        socket.destroy("oops something went wrong")
    }


});



