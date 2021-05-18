const dotenv = require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const fs = require('fs')
const listingsRouter = require('./routes/listingsAndReviews')

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) // for nested post body?
app.use(listingsRouter.router)

const baseTemplate = fs.readFileSync(__dirname + '/public/base/base.html', 'utf-8') // why utf8?
const testHtml = fs.readFileSync(__dirname + '/public/test/test.html', 'utf-8')
const loginHtml = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8')

const testPage = baseTemplate.replace('{{BODY}}', testHtml)
const loginPage = baseTemplate.replace('{{BODY}}', loginHtml)

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
    res.send(testPage)
})

app.get('/settings', (req, res) => {
    res.send(testPage)
})

const server = app.listen(process.env.PORT || 3000, (error) => {
    error ? console.log(error) : console.log('Server listening on port', server.address().port)
})
