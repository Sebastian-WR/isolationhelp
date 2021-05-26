const { date } = require("joi")
const joi = require("joi")

const validationSchema = joi.object({
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    date: joi.date().required(),
    time: joi.string().required(),
    reward: joi.string().required()
})

module.exports = {
    validationSchema
}