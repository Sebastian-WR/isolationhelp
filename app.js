const config = require('./config')
const fetch = require('node-fetch')
const express = require('express')
const fs = require('fs')
const tasksRouter = require('./routes/tasks').router

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) // for nested post body?
app.use(tasksRouter)

const baseTemplate = fs.readFileSync(__dirname + '/public/base/base.html', 'utf-8') // why utf8?
const testHtml = fs.readFileSync(__dirname + '/public/test/test.html', 'utf-8')
const loginHtml = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8')
const myTaskHtml = fs.readFileSync(__dirname + '/public/myTasks/myTasks.html', 'utf-8')

const testPage = baseTemplate.replace('{{BODY}}', testHtml)
const loginPage = baseTemplate.replace('{{BODY}}', loginHtml)
const myTasksPage = baseTemplate.replace('{{BODY}}', myTaskHtml)

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
    res.send(testPage)
})

app.get('/mytasks', (req, res) => {
    res.send(myTasksPage)
})

app.get('/settings', (req, res) => {
    res.send(testPage)
})

const server = app.listen(process.env.PORT || 3000, (error) => {
    error ? console.log(error) : console.log('Server listening on port', server.address().port)
})
