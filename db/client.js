const MongoClient = require('mongodb').MongoClient
const uri = require('../config').DB_URI
const dbName = 'isolationhelp'
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

async function connect(query) {
    let result
    try {
        await client.connect()
        console.log('mongo connected')
        result = await query()
    } catch (error) {
        console.log('mongo not connect')
        throw new Error(`Can't connect`)
    } finally {
        await client.close()
        console.log('mongo no more')
        return result
    }
}

module.exports = {
    client,
    dbName,
    connect,
}
