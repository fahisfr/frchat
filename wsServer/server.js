require('dotenv').config();
const http = require('http')
const WebSocket = require('ws')
const jwt = require("jsonwebtoken")
const dbconn = require('./config/dbConn')
const port = 3002
const getUserInfo = require('./controller/GetUserInfo');
const server = http.createServer(function (req, res) { })
const newWsConn = require('./controller/newWsConnection');
const { sendMessage, typing } = require('./controller/userEvents');
const closeWs = require('./controller/closeWs');


const clients = []

dbconn.connect(() => server.listen(port, () => console.log(`server is running on port ${port}`)))

const wss = new WebSocket.Server({
    noServer: true
})



wss.on("connection", async (ws) => {

    const [err, wsInfo] = await newWsConn(ws, clients)
    wsInfo && clients.push(wsInfo)

    ws.on("message", (message) => {
        const { event, data } = JSON.parse(message)
        switch (event) {
            case "message":
                sendMessage(data, clients)
                break;
            case "typing":
                typing(data, clients)
                break
        }
    })
    ws.on("close", () => {
        closeWs(ws._user, clients)
        clients.splice(clients.indexOf(ws), 1)
    })

})

server.on('upgrade', function upgrade(request, socket, head) {

    try {

        const auccesstoken = request.url.split('a?')[1]
        if (!auccesstoken) return socket.end("token is missing")

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
        socket.end("oops something went wrong")
    }


});

