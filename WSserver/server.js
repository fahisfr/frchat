
require('dotenv').config();
const http = require('http')

const WebSocket = require('ws')
const jwt = require("jsonwebtoken")
const { faker } = require('@faker-js/faker');
const { response } = require('express');
const { client } = require('websocket');

const user = {
    name: faker.name.findName(),
    avatar: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    number: faker.phone.phoneNumber(),
}

const server = http.createServer(function (req, res) {

})

const wss = new WebSocket.Server({
    noServer: true
})

wss.on("connection", (client) => {
    console.log(client.user)
   
    
})



server.on('upgrade', async function upgrade(request, socket, head) {
    const token = request.url.split("=")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) return socket.end()
         wss.handleUpgrade(request, socket, head, function done(ws) {
             ws.user = decode
                wss.emit('connection', ws, request);
        })
    })
     
           


});



server.listen(4000, () => {

})