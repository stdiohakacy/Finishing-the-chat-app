const express = require('express')
const app = express()
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(9000)
const io = socketio(expressServer, {
    path: '/socket.io',
    serveClient: true,
    wsEngine: 'ws'
})

io.on('connection', socket => {
    socket.emit('messageFromServer', { data: "welcome to the socketio server" })
    socket.on('messageToServer', dataFromClient => {
        console.log(dataFromClient)
    })

    socket.on('newMessageToServer', msg => {
        // io.emit('messageToClients', { text: msg.text })
        io.of('/').emit('messageToClients', { text: msg.text })
    })

    setTimeout(() => {
        io.of('/admin').emit('welcome', 'welcome to admin channel, form the main channel')
    }, 2000);
})

io.of('/admin').on('connection', socket => {
    console.log('Someone connected to the admin names')
    io.of('/admin').emit('welcome', "welcome to admin channel")
})
