const client = require('../client')
const colName = 'listings'

// const readOne = (option) => {
//     return connect(() => {
//         return (result = client.db(dbName).collection(colName).findOne(option))
//     })
// }

const readOneOrMore = async (options) => {
    try {
        const db = await client.getDB()
        const cursor = db.collection(colName).find(options)
        return await cursor.toArray()
    } catch (error) {
        console.log(error)
    }
}
const createOne = () => {}
const createOneOrMore = () => {}
const updateOne = () => {}
const deleteOne = () => {}

module.exports = {
    //readOne,
    readOneOrMore,
    createOne,
    createOneOrMore,
    updateOne,
    deleteOne,
}
