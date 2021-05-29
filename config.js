const dotenv = require('dotenv').config()

module.exports = {
    dbUri: process.env.DB_URI || 'mongodb://localhost:27017',
    mail: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    auth: {
        host: process.env.HOST,
        secret: process.env.AUTH_SECRET,
        expire: process.env.AUTH_EXPIRE,
    },
}
