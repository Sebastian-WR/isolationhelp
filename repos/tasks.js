const client = require('../db/client')
const ObjectId = require('mongodb').ObjectId
const colName = 'tasks'

const readOne = async (id) => {
    let task = {}
    try {
        const db = await client.getDB()
        task = await db.collection(colName).findOne(ObjectId(id))
    } catch (error) {
        console.log(error)
    }
    return task
}

const readOneOrMore = async (fields) => {
    let tasks = []
    try {
        const db = await client.getDB()
        tasks = await db.collection(colName).find(fields).toArray()
    } catch (error) {
        console.log(error)
    }
    return tasks
}
const createOne = async (doc) => {
    let success
    try {
        const db = await client.getDB()
        const result = await db.collection(colName).insertOne(doc)
        result.insertedCount === 1 ? (success = true) : (success = false)
    } catch (error) {
        console.log(error)
    }
    return success
}
const updateOne = async (id, fields) => {
    const filter = { _id: id }
    const options = { upsert: false }
    const doc = {
        $set: fields,
    }
    let success
    try {
        const db = await client.getDB()
        const result = await db.collection(colName).updateOne(filter, doc, options)
        result.matchedCount === 1 ? (success = true) : (success = false)
    } catch (error) {
        console.log(error)
    }
    return success
}

const deleteOne = async (field) => {
    let success
    try {
        const db = await client.getDB()
        const result = await db.collection(colName).deleteOne(field)
        result.deletedCount === 1 ? (success = true) : (success = false)
    } catch (error) {
        console.log(error)
    }
    return success
}

module.exports = {
    readOne,
    readOneOrMore,
    createOne,
    updateOne,
    deleteOne,
}
