const dotenv = require('dotenv').config()
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017'

module.exports = {
    DB_URI,
}
