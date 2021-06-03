const client = require('../util/client')
const ObjectId = require('mongodb').ObjectId
const colName = 'tasks'

const Joi = require('joi')
//category SHOPPING, GARDENING, CLEANING, ANIMALS
const schema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().allow(''),
    reward: Joi.string().allow(''),
    location: Joi.string().allow(''),
    date: Joi.date().allow(''),
    createdById: Joi.string().required(),
    takenById: Joi.string().allow(''),
    time: Joi.string().allow('').pattern(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')),
})

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

const readNotYours = async (field) => {
    let tasks = []
    try {
        const db = await client.getDB()
        tasks = await db
            .collection(colName)
            .find({ createdById: { $ne: field } })
            .toArray()
    } catch (error) {
        console.log(error)
    }
    return tasks
}

const createOne = async (doc) => {
    let success = false
    try {
        const value = await schema.validateAsync(doc)
        const db = await client.getDB()
        const result = await db.collection(colName).insertOne(doc)
        if (result.insertedCount === 1) {
            success = true
        } else {
            success = false
        }
    } catch (error) {
        return error.details[0].message
        //console.log(error.details[0].message)
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
    readMyTasks,
    readNotYours,
    createOne,
    updateOne,
    deleteOne,
}
