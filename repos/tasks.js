const client = require('../util/client')
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

const readMyTasks = async (field) => {
    let tasks = []
    try {
        const db = await client.getDB()
        tasks = await db.collection(colName).find({ createdById: field }).toArray()
    } catch (error) {
        console.log(error)
    }
    return tasks
}

const readMyVolunteer = async (field) => {
    let tasks = []
    try {
        const db = await client.getDB()
        tasks = await db.collection(colName).find({ takenById: field }).toArray()
    } catch (error) {
        console.log(error)
    }
    return tasks
}

const readNotYours = async (field) => {
    let tasks = []
    try {
        const db = await client.getDB()
        tasks = await db
            .collection(colName)
            .find({ createdById: { $ne: field }, takenById: { $ne: field } })
            .toArray()
    } catch (error) {
        console.log(error)
    }
    return tasks
}

const createOne = async (doc) => {
    let success = false
    try {
        const db = await client.getDB()
        const result = await db.collection(colName).insertOne(doc)
        if (result.insertedCount === 1) {
            success = true
        } else {
            success = false
        }
    } catch (error) {
        return error
    }
    return success
}
const removeField = async (id, fields) => {
    const filter = { _id: ObjectId(id) }
    const options = { upsert: false }
    const update = {
        $unset: fields,
    }
    let success
    try {
        const db = await client.getDB()
        const result = await db.collection(colName).updateOne(filter, update, options)
        result.matchedCount === 1 ? (success = true) : (success = false)
    } catch (error) {
        console.log(error)
    }
    return success
}
const updateOne = async (id, fields) => {
    const filter = { _id: ObjectId(id) }
    const options = { upsert: false }
    const update = {
        $set: fields,
    }
    let success
    try {
        const db = await client.getDB()
        const result = await db.collection(colName).updateOne(filter, update, options)
        result.matchedCount === 1 ? (success = true) : (success = false)
    } catch (error) {
        console.log(error)
    }
    return success
}

const deleteOne = async (field) => {
    id = {
        _id: ObjectId(field),
    }
    let success
    try {
        const db = await client.getDB()
        const result = await db.collection(colName).deleteOne(id)
        result.deletedCount === 1 ? (success = true) : (success = false)
    } catch (error) {
        console.log(error)
    }
    return success
}

module.exports = {
    readOne,
    readOneOrMore,
    readMyTasks,
    readMyVolunteer,
    readNotYours,
    createOne,
    updateOne,
    removeField,
    deleteOne,
}
