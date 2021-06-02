const router = require('express').Router()
const tasksRepo = require('../repos/tasks')

//TODO: add logging
const isAuth = (req, res, next) => {
    if (!req.session.isAuth) {
        console.log({ error: 'Yessir' })
        return res.status(204).send({ error: 'Not authenticated' })
    }
    next()
}
router.use(isAuth)

// TODO: Server side data validation Mongoose or Joi
router.get('/', async (req, res) => {
    let tasks
    const id = req.session.userId
    const sort = req.query.sort
    if (sort === 'notyours') {
        tasks = await tasksRepo.readNotYours(id)
    } else if (sort === 'mytasks') {
        tasks = await tasksRepo.readMyTasks(id)
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
    let task = await tasksRepo.readOne(id)
    if (task) {
        console.log('task found')
        return res.send({ task })
    }
    console.log('task missing')
    res.send({ error: 'task missing' })
})

router.post('/', async (req, res) => {
    const doc = {}
    if (req.body.title) doc.title = req.body.title
    if (req.body.description) doc.description = req.body.description
    if (req.body.category) doc.category = req.body.category
    if (req.body.reward) doc.reward = req.body.reward
    if (req.body.location) doc.location = req.body.location
    if (req.body.date) doc.date = req.body.date
    if (req.session.userId) doc.createdById = req.session.userId
    if (req.body.time) doc.time = req.body.time
    let success = await tasksRepo.createOne(doc)
    if (success !== true) {
        return res.send({ success })
    }

    res.redirect('/myTasks')
})

//TODO: only update your own if not admin
router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const fields = req.body
    let success = await tasksRepo.updateOne(id, fields)
    if (success) {
        console.log('task updated')
        return res.send({ success })
    }
    console.log('No task found')
    res.send({ error: 'No tasks found' })
})

//TODO: only deleted your own if not admin
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
