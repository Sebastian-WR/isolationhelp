const socket = io()

$('#chat-form').submit((e) => {
    const chatmsg = $('#chat-input')
    e.preventDefault()
    if (chatmsg.val()) {
        socket.emit('client_chat_message', chatmsg.val())
        chatmsg.val('')
    }
})

socket.on('server_chat_message', (msg) => {
    const message = $('<li>').text(msg)
    $('#messages').prepend(message)
})
