const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const confirmationTemplate = fs.readFileSync(
    path.join(__dirname + '/../public/email/confirmation.html'),
    'utf-8',
)
const mail = require('../config').mail

// TODO: Error handeling
// - what if token does not exist
// - what if no email
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mail.user,
        pass: mail.pass,
    },
})
// TODO replase localhost with process.env.somethig
const sendConfirmation = async (email, token) => {
    const link = `${process.env.HOST}/auth/?authToken=${token}`
    let result = false
    const confirmationHtml = confirmationTemplate.replace('{{LINK}}', link)
    const options = {
        from: mail.user,
        to: email,
        subject: 'Confirm you email adress',
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
