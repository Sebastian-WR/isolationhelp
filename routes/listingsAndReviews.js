const router = require('express').Router()
const MongoClient = require('mongodb').MongoClient

const db_database = process.env.DB_DATABASE
const db_host = process.env.DB_HOST
const db_user = process.env.DB_USER
const db_password = process.env.DB_PASSWORD

const dbName = 'sample_airbnb'
const colName = 'listingsAndReviews'

const url = `mongodb+srv://${db_user}:${db_password}@${db_host}/${db_database}?retryWrites=true&w=majority`

router.get('/api/getAll', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            throw new Error(error)
        }

        const db = client.db(dbName)
        const collection = db.collection(colName)

        collection.find().toArray((error, data) => {
            if (error) {
                res.send({ error })
            }
            console.log(data)
            res.send({ data })
            client.close()
        })
    })
})

module.exports = {
    router,
}
