const router = require('express').Router()
const tasksRepo = require('../repos/tasks')

router.get('/api/tasks', async (req, res) => {
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

router.get('/api/tasks/:id', async (req, res) => {
    const id = req.params.id
    let task = await tasksRepo.readOne(id)
    if (task) {
        console.log('task found')
        return res.send({ task })
    }
    console.log('task missing')
    res.send({ error: 'task missing' })
})

router.post('/api/tasks', async (req, res) => {
    const doc = req.body
    let success = await tasksRepo.createOne(doc)
    if (success) {
        console.log('task created')
        return res.send({ success })
    }
    console.log('No task created')
    res.send({ error: 'No tasks created' })
})

router.patch('/api/tasks/:id', async (req, res) => {
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

router.delete('/api/tasks/:id', async (req, res) => {
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
