const config = require('./config')
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

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://ajax.googleapis.com',
                    'https://cdn.jsdelivr.net/',
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://cdnjs.cloudflare.com',
                    'https://cdn.jsdelivr.net/',
                ],
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

const baseTemplate = fs.readFileSync(__dirname + '/public/base/base.html', 'utf-8') // why utf8?
const testHtml = fs.readFileSync(__dirname + '/public/test/test.html', 'utf-8')
const loginHtml = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8')
const myTasksHtml = fs.readFileSync(__dirname + '/public/myTasks/myTasks.html', 'utf-8')
const createTaskHtml = fs.readFileSync(__dirname + '/public/myTasks/createTask.html', 'utf-8')
const taskHtml = fs.readFileSync(__dirname + '/public/tasks/tasks.html', 'utf-8')
const errorHtml = fs.readFileSync(__dirname + '/public/error/error.html', 'utf-8')
const authHtml = fs.readFileSync(__dirname + '/public/auth/auth.html', 'utf-8')

const testPage = baseTemplate.replace('{{BODY}}', testHtml)
const loginPage = baseTemplate.replace('{{BODY}}', loginHtml)
const myTasksPage = baseTemplate.replace('{{BODY}}', myTasksHtml)
const createTaskPage = baseTemplate.replace('{{BODY}}', createTaskHtml)
const tasksPage = baseTemplate.replace('{{BODY}}', taskHtml)
const errorPage = baseTemplate.replace('{{BODY}}', errorHtml)

app.get('/', (req, res, next) => {
    if (!req.session.isAuth) return res.redirect('/auth')
    next()
})

app.get('/', (req, res) => {
    res.send(testPage)
})

app.get('/auth', (req, res) => {
    res.send(authHtml)
})

app.get('/login', (req, res) => {
    res.send(loginPage)
})

app.get('/chats', (req, res) => {
    res.send(testPage)
})

app.get('/tasks', (req, res) => {
    res.send(tasksPage)
})

app.get('/tasks/:id', (req, res) => {
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

const server = app.listen(process.env.PORT || 3000, (error) => {
    error ? console.log(error) : console.log('Server listening on port', server.address().port)
})
