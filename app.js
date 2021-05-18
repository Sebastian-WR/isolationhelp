const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) // for nested post body?

// const __dirname = dirname(fileURLToPath(import.meta.url)) // https://nodejs.org/docs/latest-v12.x/api/esm.html#esm_no_require_exports_module_exports_filename_dirname
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
