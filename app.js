const config = require('./config')
const fetch = require('node-fetch')
const helmet = require('helmet')
const express = require('express')
const fs = require('fs')
const tasksRouter = require('./routes/tasks').router
const authRouter = require('./routes/auth').router

const app = express()

app.use(express.json())
app.use(express.static('public'))
//app.use(express.urlencoded({ extended: true }))
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'https://ajax.googleapis.com'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
                fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                imgSrc: ["'self'", 'data:'],
            },
        },
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
const registerHtml = fs.readFileSync(__dirname + '/public/register/register.html', 'utf-8')

const testPage = baseTemplate.replace('{{BODY}}', testHtml)
const loginPage = baseTemplate.replace('{{BODY}}', loginHtml)
const myTasksPage = baseTemplate.replace('{{BODY}}', myTasksHtml)
const createTaskPage = baseTemplate.replace('{{BODY}}', createTaskHtml)
const tasksPage = baseTemplate.replace('{{BODY}}', taskHtml)
const errorPage = baseTemplate.replace('{{BODY}}', errorHtml)

app.get('/', (req, res) => {
    res.send(testPage)
})

app.get('/register', (req, res) => {
    res.send(registerHtml)
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
