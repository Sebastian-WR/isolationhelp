const router = require('express').Router()
const tasksRepo = require('../repos/tasks')


router.get('/', async (req, res) => {
    const id = req.session.userId
    let tasks = await tasksRepo.readOneOrMore({ createdById: id })
    if (tasks.length > 0) {
        console.log('tasks found')
        return res.send({ tasks })
    }
    console.log('No tasks found')
    res.send({ error: 'No tasks found' })
})


module.exports = {
    router,
}