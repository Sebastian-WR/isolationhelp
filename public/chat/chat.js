var socket = io()

var messagelist = document.getElementById('messages')
var form = document.getElementById('form')
var chatmsg = document.getElementById('chat-input')

form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (chatmsg.value) {
        socket.emit('chat message', chatmsg.value)
        chatmsg.value = ''
    }
})

socket.on('chat message', function (msg) {
    var message = document.createElement('li')
    message.textContent = msg
    messagelist.appendChild(message)
    window.scrollTo(0, document.body.scrollHeight)
})
