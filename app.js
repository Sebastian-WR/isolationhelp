const config = require('./config')
const fetch = require('node-fetch')
const express = require('express')
const fs = require('fs')
const tasksRouter = require('./routes/tasks').router
const client = require('./db/client')
const session = require('express-session')
const bodyParser = require('body-parser')

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) // for nested post body?
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}))
app.use(tasksRouter)


const baseTemplate = fs.readFileSync(__dirname + '/public/base/base.html', 'utf-8') // why utf8?

const testHtml = fs.readFileSync(__dirname + '/public/test/test.html', 'utf-8')
const loginHtml = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8')
const myTasksHtml = fs.readFileSync(__dirname + '/public/myTasks/myTasks.html', 'utf-8')
const createTaskHtml = fs.readFileSync(__dirname + '/public/myTasks/createTask.html', 'utf-8')
const taskHtml = fs.readFileSync(__dirname + '/public/tasks/tasks.html', 'utf-8')
const oneTaskHtml = fs.readFileSync(__dirname + '/public/tasks/oneTask.html', 'utf-8')
const errorHtml = fs.readFileSync(__dirname + '/public/error/error.html', 'utf-8')

const testPage = baseTemplate.replace('{{BODY}}', testHtml)
const loginPage = baseTemplate.replace('{{BODY}}', loginHtml)
const myTasksPage = baseTemplate.replace('{{BODY}}', myTasksHtml)
const createTaskPage = baseTemplate.replace('{{BODY}}', createTaskHtml)
const tasksPage = baseTemplate.replace('{{BODY}}', taskHtml)
const oneTaskPage = baseTemplate.replace('{{BODY}}', oneTaskHtml)
const errorPage = baseTemplate.replace('{{BODY}}', errorHtml)

app.get('/', (req, res) => {
    res.send(testPage)
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
    res.send(oneTaskPage)
})

app.get('/myTasks', (req, res) => {
    res.send(myTasksPage)
})

app.get('/createTask', (req, res) => {
    let sessionVariable = req.session.valid
    if (sessionVariable === true) {
        console.log(sessionVariable);
        req.session.valid = null
    }
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

server.on('close', () => {
    client.close()
})

process.on('SIGINT', () => {
    server.close()
})
