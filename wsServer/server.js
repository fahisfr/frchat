require('dotenv').config();
const http = require('http')
const WebSocket = require('ws')
const jwt = require("jsonwebtoken")
const dbconn = require('./config/dbConn')
const getUserInfo = require('./controller/GetUserInfo');
const server = http.createServer(function (req, res) { })
const wsController = require('./controller/wsController')
const reids = require('./config/redis')

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
    const auccesstoken = request.url.split('=')[1]
    
    if (!auccesstoken) return socket.destroy("unauthorized")
    jwt.verify(auccesstoken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return socket.end('Unauthorized')

        // const findUserInfo = await reids.get(`userInfo_${decoded.number}`)
     
        // if (findUserInfo) {
        //      return wss.handleUpgrade(request, socket, head, function done(ws) {
        //         ws._user = JSON.parse(findUserInfo)
        //         wss.emit('connection', ws, request)
        //     })
            
            
        // } 
        getUserInfo(decoded).then(result => {
            if (result.length == 0) {
                return wss.handleUpgrade(request, socket, head, function done(ws) {
                    ws._user = {
                        number: decoded.number,
                        contacts: []
                    }
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



