const config = require('./util/config')
const fetch = require('node-fetch')
const client = require('./util/client')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const fs = require('fs')

const tasksRouter = require('./routes/tasks').router
const authRouter = require('./routes/auth').router

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://ajax.googleapis.com', 'https://cdn.jsdelivr.net/'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net/'],
                fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                imgSrc: ["'self'", 'data:'],
            },
        },
    }),
)
app.use(
    session({
        secret: config.auth.secret,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            clientPromise: client.getClient(),
            dbName: client.dbName,
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: parseInt(config.auth.expire),
        },
    }),
)

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }),
)
app.use(
    '/auth',
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
    }),
)

app.use('/api/tasks', tasksRouter)
app.use('/api/auth', authRouter)

const authHtml = fs.readFileSync(__dirname + '/public/auth/auth.html', 'utf-8')
const baseTemplate = fs.readFileSync(__dirname + '/public/base/base.html', 'utf-8')
const dashboardHtml = fs.readFileSync(__dirname + '/public/dashboard/dashboard.html', 'utf-8')
const chatHtml = fs.readFileSync(__dirname + '/public/chat/chat.html', 'utf-8')
const tasksHtml = fs.readFileSync(__dirname + '/public/tasks/tasks.html', 'utf-8')
const taskHtml = fs.readFileSync(__dirname + '/public/task/task.html', 'utf-8')
const myTasksHtml = fs.readFileSync(__dirname + '/public/myTasks/myTasks.html', 'utf-8')
const createTaskHtml = fs.readFileSync(__dirname + '/public/createTask/createTask.html', 'utf-8')
const myVolunteeringHtml = fs.readFileSync(__dirname + '/public/myVolunteering/myVolunteering.html', 'utf-8')
const errorHtml = fs.readFileSync(__dirname + '/public/error/error.html', 'utf-8')
const settingsHtml = fs.readFileSync(__dirname + '/public/settings/settings.html', 'utf-8')

const dashboardPage = baseTemplate
    .replace('{{BODY}}', dashboardHtml)
    .replace('navLink" href="/"', 'navLinkActive" href="/"')
const chatPage = baseTemplate
    .replace('{{BODY}}', chatHtml)
    .replace('navLink" href="/chats"', 'navLinkActive" href="/chats"')
const tasksPage = baseTemplate
    .replace('{{BODY}}', tasksHtml)
    .replace('navLink" href="/tasks"', 'navLinkActive" href="/tasks"')
const taskPage = baseTemplate.replace('{{BODY}}', taskHtml)
const myTasksPage = baseTemplate
    .replace('{{BODY}}', myTasksHtml)
    .replace('navLink" href="/mytasks"', 'navLinkActive" href="/mytasks"')
const createTaskPage = baseTemplate.replace('{{BODY}}', createTaskHtml)
const myVolunteeringPage = baseTemplate
    .replace('{{BODY}}', myVolunteeringHtml)
    .replace('navLink" href="/myvolunteering"', 'navLinkActive" href="/myvolunteering"')
const errorPage = baseTemplate.replace('{{BODY}}', errorHtml)
const settingsPage = baseTemplate
    .replace('{{BODY}}', settingsHtml)
    .replace('navLink" href="/settings"', 'navLinkActive" href="/settings"')

app.get('/auth', (req, res) => {
    res.send(authHtml)
})

app.get('/*', (req, res, next) => {
    if (!req.session.isAuth) return res.redirect('/auth')
    next()
})

app.get('/', (req, res) => {
    res.send(dashboardPage)
})

app.get('/chats', (req, res) => {
    res.send(chatPage)
})

app.get('/tasks', (req, res) => {
    res.send(tasksPage)
})

app.get('/tasks/info', (req, res) => {
    res.send(taskPage)
})

app.get('/myTasks', (req, res) => {
    res.send(myTasksPage)
})

app.get('/myTasks/new', (req, res) => {
    res.send(createTaskPage)
})

app.get('/myVolunteering', (req, res) => {
    res.send(myVolunteeringPage)
})

app.get('/myVolunteering/info', (req, res) => {
    res.send(taskPage)
})

app.get('/settings', (req, res) => {
    res.send(settingsPage)
})

app.get('/*', (req, res) => {
    res.status(404).send(errorPage)
})

server.listen(process.env.PORT || 3000, (error) => {
    error ? console.log(error) : console.log('Server listening on port', server.address().port)
})

io.on('connection', (socket) => {
    socket.on('chat_message', (message) => {
        io.emit('chat_message', message)
    })
})

server.on('close', () => {
    client.close()
})

process.on('SIGINT', () => {
    server.close()
})
