require('dotenv').config();
const http = require('http')
const WebSocket = require('ws')
const jwt = require("jsonwebtoken")
const dbconn = require('./config/dbConn')
const port = 4002
const server = http.createServer() 
const newWsConn = require('./controller/newWsConnection');
const { sendMessage, typing } = require('./controller/userEvents');
const closeWs = require('./controller/closeWs');


Set.prototype.find = function (callback) {
    for (c of this) { 
        if (callback(c)) {
            return c
        }
    }
}

dbconn.connect(() => server.listen(port, () => console.log(`server is running on port ${port}`)))

const wss = new WebSocket.Server({
    noServer: true
})



wss.on("connection", async (ws) => {

    const clients = wss.clients
    const [err, wsInfo] = await newWsConn(ws, clients)

    console.log(ws._user.number, "is connected")

    if (wsInfo) {
        ws._user = wsInfo
    }

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
        closeWs(ws, clients)
        console.log(ws._user.number, "is disconnected")
    })

})

server.on('upgrade', function upgrade(request, socket, head) {

    try {

        const auccesstoken = request.url.split('a?')[1]
        if (!auccesstoken) return socket.end("token is missing")

        jwt.verify(auccesstoken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        
            if (err) return socket.end('Unauthorized')


            wss.handleUpgrade(request, socket, head, function done(ws) {
                ws._user = decoded
                wss.emit('connection', ws, request)
            })
        })
    }
    catch (err) {
        socket.end('oops something went wrong :(')
    }


});

