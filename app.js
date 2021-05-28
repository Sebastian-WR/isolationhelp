/*----imports----*/
const config = require('./config')
const client = require('./db/client')
const fetch = require('node-fetch')
const fs = require('fs')
const express = require('express')
const tasksRouter = require('./routes/tasks').router
const {addUser, getUser, deleteUser, getUsers} = require('./public/chat/users')

/*---server setup---*/
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')

/*---middelwares---*/
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) // for nested post body?
app.use(tasksRouter)
app.use(cors())

/*---file reads---*/
const baseTemplate = fs.readFileSync(__dirname + '/public/base/base.html', 'utf-8') // why utf8?

const testHtml = fs.readFileSync(__dirname + '/public/test/test.html', 'utf-8')
const loginHtml = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8')
const myTasksHtml = fs.readFileSync(__dirname + '/public/myTasks/myTasks.html', 'utf-8')
const createTaskHtml = fs.readFileSync(__dirname + '/public/myTasks/createTask.html', 'utf-8')
const taskHtml = fs.readFileSync(__dirname + '/public/tasks/tasks.html', 'utf-8')
const oneTaskHtml = fs.readFileSync(__dirname + '/public/tasks/oneTask.html', 'utf-8')
const errorHtml = fs.readFileSync(__dirname + '/public/error/error.html', 'utf-8')
const chatHtml = fs.readFileSync(__dirname + '/public/chat/chat.html', 'utf-8')

/*diy template lang*/
const testPage = baseTemplate.replace('{{BODY}}', testHtml)
const loginPage = baseTemplate.replace('{{BODY}}', loginHtml)
const myTasksPage = baseTemplate.replace('{{BODY}}', myTasksHtml)
const createTaskPage = baseTemplate.replace('{{BODY}}', createTaskHtml)
const tasksPage = baseTemplate.replace('{{BODY}}', taskHtml)
const oneTaskPage = baseTemplate.replace('{{BODY}}', oneTaskHtml)
const errorPage = baseTemplate.replace('{{BODY}}', errorHtml)
const chatPage = baseTemplate.replace('{{BODY}}', chatHtml)

/*-----routes-----*/
app.get('/', (req, res) => {
    res.send(testPage)
})

app.get('/login', (req, res) => {
    res.send(loginPage)
})

app.get('/chats', (req, res) => {
    res.send(chatPage)
})

app.get('/tasks', (req, res) => {
    res.send(tasksPage)
})

app.get('/tasks/:id', (req, res) => {
    res.send(oneTaskPage)
})

app.get('/tasks/new', (req, res) => {
    res.send(tasksPage)
})

app.get('/myTasks', (req, res) => {
    res.send(myTasksPage)
})

app.get('/createTask', (req, res) => {
    res.send(createTaskPage)
})

app.get('/settings', (req, res) => {
    res.send(testPage)
})

app.get('/*', (req, res) => {
    res.status(404).send(errorPage)
})

/* server init */
server.listen(process.env.PORT || 3000, (error) => {
    error ? console.log(error) : console.log('Server listening on port', server.address().port)
})

io.on('connection', (socket) => {
    console.log('User Connected')

    socket.on('chat message', msg => {
        io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
        console.log('A User Disconnected')
    })
})

// io.on('connection', (socket) => {
//     socket.on('login', ({ name, room }, callback) => {
//         console.log("A socket connected with id", socket.id);
//         const { user, error } = addUser(socket.id, name, room)
//         if (error) return callback(error)
//         socket.join(user.room)
//         socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
//         io.in(room).emit('users', getUsers(room))
//         callback()
//     })

//     socket.on('sendMessage', message => {
//         const user = getUser(socket.id)
//         io.in(user.room).emit('message', { user: user.name, text: message });
//     })

//     socket.on("disconnect", () => {
//         console.log("User disconnected");
//         const user = deleteUser(socket.id)
//         if (user) {
//             io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
//             io.in(user.room).emit('users', getUsers(user.room))
//         }
//     })
// })

server.on('close', () => {
    client.close()
})

process.on('SIGINT', () => {
    server.close()
})
