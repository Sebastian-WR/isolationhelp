const { client, dbName, connect } = require('../client')
const colName = 'listings'

const readOne = (option) => {
    return connect(() => {
        return (result = client.db(dbName).collection(colName).findOne(option))
    })
}

const readOneOrMore = async (options) => {
    const result = await connect(async () => {
        const cursor = client.db(dbName).collection(colName).find(options)
        const results = await cursor.toArray()
        return results
    })
    return result
}
const createOne = () => {}
const createOneOrMore = () => {}
const updateOne = () => {}
const deleteOne = () => {}

module.exports = {
    readOne,
    readOneOrMore,
    createOne,
    createOneOrMore,
    updateOne,
    deleteOne,
}
