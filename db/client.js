const MongoClient = require('mongodb').MongoClient
const uri = require('../config').DB_URI
const dbName = 'isolationhelp'
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 50,
})

async function connect() {
    try {
        await client.connect()
        console.log('mongo connected')
    } catch (error) {
        console.log('mongo not connect')
        throw new Error(`Can't connect`)
    }
}

const getDB = async () => {
    if (!client.isConnected()) {
        await connect()
    }
    return client.db(dbName)
}

async function close() {
    if (client.isConnected()) {
        console.log('mongo was connected')
        await client.close()
        console.log('mongo no more connect')
    }
}

module.exports = {
    getDB,
    close,
}
