const MongoClient = require('mongodb').MongoClient
const uri = require('./config').dbUri
const dbName = 'isolationhelp'

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 50,
})

const connect = async () => {
    try {
        await client.connect()
        console.log('Database connection established')
    } catch (error) {
        throw new Error(`Can't connect`)
    }
}

const getDB = async () => {
    if (!client.isConnected()) {
        await connect()
    }
    return client.db(dbName)
}

const getClient = async () => {
    if (!client.isConnected()) {
        await connect()
    }
    return client
}

const close = async () => {
    if (client.isConnected()) {
        await client.close()
        console.log('Database connection ended')
    }
}

module.exports = {
    getDB,
    dbName,
    getClient,
    close,
}
