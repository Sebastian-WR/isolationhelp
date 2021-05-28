const client = require('../util/client')
const colName = 'users'
const ObjectId = require('mongodb').ObjectId
const Joi = require('joi')

// TODO:
// Update validation constraints
// Update error handeling

const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    validated: Joi.boolean().required(),
    token: Joi.string(),
})

const readOne = async (field) => {
    let user
    try {
        const db = await client.getDB()
        if (field.id) {
            user = await db.collection(colName).findOne(ObjectId(field))
        } else {
            user = await db.collection(colName).findOne(field)
        }
    } catch (error) {
        console.log(error)
    }
    return user
}

const readOneOrMore = async (fields) => {
    let users = []
    try {
        const db = await client.getDB()
        users = await db.collection(colName).find(fields).toArray()
    } catch (error) {
        console.log(error)
    }
    return users
}
const createOne = async (doc) => {
    let result = false
    try {
        const value = await schema.validateAsync(doc)
        if (!value) return result

        const db = await client.getDB()
        const response = await db.collection(colName).insertOne(doc)
        response.insertedCount === 1 ? (result = true) : (result = false)
    } catch (error) {
        console.log(error)
    }
    return result
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
