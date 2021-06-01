const router = require('express').Router()
const tasksRepo = require('../repos/tasks')

// TODO: Server side data validation Mongoose or Joi
router.get('/', async (req, res) => {
    let tasks
    if (req.query) {
        tasks = await tasksRepo.readOneOrMore(req.query)
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
    if (req.body.text) doc.text = req.body.text

    let success = await tasksRepo.createOne(doc)
    if (success !== true) {
        return res.send({ success })
    }

    res.send({ success })
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
