var socket = io()

var messagelist = $('#messages')
var form = $('#chat-form')
var chatmsg = $('#chat-input')

form.submit((e) => {
    e.preventDefault()
    if (chatmsg.val()) {
        socket.emit('chat_message', chatmsg.val())
        chatmsg.val('')
    }
})

socket.on('chat_message', (msg) => {
    var message = $('<li>').text(msg)
    messagelist.append(message)
})
