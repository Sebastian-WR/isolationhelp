const router = require('express').Router()
const tasksRepo = require('../repos/tasks')
const Joi = require('joi')

/* TODO:
 ** Update validation constraints
 */

const Category = Object.freeze({
    SHOPPING: 'SHOPPING',
    GARDENING: 'GARDENING',
    CLEANING: 'CLEANING',
    ANIMALS: 'ANIMALS',
})
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

const isAuth = (req, res, next) => {
    if (!req.session.isAuth) {
        console.log({ error: 'Yessir' })
        return res.status(204).send({ error: 'Not authenticated' })
    }
    next()
}
router.use(isAuth)

router.get('/', async (req, res) => {
    let tasks
    const id = req.session.userId
    const sort = req.query.sort
    if (sort === 'notyours') {
        tasks = await tasksRepo.readNotYours(id)
    } else if (sort === 'mytasks') {
        tasks = await tasksRepo.readMyTasks(id)
    } else if (sort === 'myvolunteering') {
        tasks = await tasksRepo.readMyVolunteer(id)
    } else {
        tasks = await tasksRepo.readOneOrMore()
    }

    if (tasks.length > 0) {
        console.log('tasks found')
        return res.send({ tasks })
    }
    console.log('No tasks found')
    res.send({ error: 'No tasks found' })
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    if (!id) res.send({ error: 'no id' })
    let task = await tasksRepo.readOne(id)
    if (task) {
        console.log('task found')
        return res.send({ task })
    }
    console.log('task missing')
    res.send({ error: 'task missing' })
})

router.post('/', async (req, res) => {
    const task = req.body.task
    const doc = {}
    if (task.title) doc.title = task.title
    if (task.description) doc.description = task.description
    if (task.category) doc.category = task.category
    if (task.reward) doc.reward = task.reward
    if (task.location) doc.location = task.location
    if (task.date) doc.date = task.date
    if (task.time) doc.time = task.time
    if (req.session.userId) doc.createdById = req.session.userId

    try {
        await schema.validateAsync(doc)
    } catch (error) {
        return res.send({ error: error.message })
    }

    let success = await tasksRepo.createOne(doc)
    if (!success) {
        return res.send({ error: 'Error adding' })
    }
    res.send({ success })
})

//TODO: only update your own if not admin only take not yours
router.patch('/:id', async (req, res) => {
    let success
    const id = req.params.id
    const type = req.body.type
    const fields = req.body.fields
    const userId = req.session.userId
    if (type == 'take' && userId) {
        field = {
            takenById: userId,
        }
        success = await tasksRepo.updateOne(id, field)
    } else if (type == 'remove') {
        console.log('removed action')
        field = {
            takenById: '',
        }
        success = await tasksRepo.removeField(id, field)
    } else {
        success = await tasksRepo.updateOne(id, fields)
    }

    if (success) {
        console.log('task updated')
        return res.send({ success })
    }
    console.log('No task found')
    res.send({ error: 'No tasks found' })
})

//TODO: only delete your own if not admin
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    let success = await tasksRepo.deleteOne(id)
    if (success) {
        console.log('task deleted', id)
        return res.send({ success })
    }
    console.log('No task deleted')
    res.send({ error: 'No tasks deleted' })
})

module.exports = {
    router,
}
