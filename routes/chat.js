const router = require('express').Router()

router.get('/', (req, res) => {
    const io = req.app.io
    console.log('oi there', io)
    io.on('connection', (socket) => {
        console.log('A socket connected with id: ', socket.id)
        socket.on('message', (data) => {
            console.log(data.user + ': ' + data.chat)
            io.emit('response', data) // broadcast emit user: chat
        })
    })
    res.send({ message: 'hello' })
})

module.exports = {
    router,
}
