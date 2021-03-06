const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const confirmationTemplate = fs.readFileSync(path.join(__dirname + '/../public/email/confirmation.html'), 'utf-8')
const { mail, host } = require('./config')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mail.user,
        pass: mail.pass,
    },
})

const sendConfirmation = async (email, token) => {
    const link = `${host}/auth/?authToken=${token}`
    let result = false
    const confirmationHtml = confirmationTemplate.replace('{{LINK}}', link)
    const options = {
        from: mail.user,
        to: email,
        subject: 'Confirm you email address',
        html: confirmationHtml,
    }
    try {
        const response = await transporter.sendMail(options)
        if (response) {
            result = true
        }
    } catch (error) {}

    return result
}

module.exports = {
    sendConfirmation,
}
