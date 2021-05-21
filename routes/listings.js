const router = require('express').Router()
const listingsDb = require('../db/listings/listings')

router.get('/api/listings', async (req, res) => {
    let listings = await listingsDb.readOneOrMore()
    res.send({ listings })
})

router.get('/api/listings/:id', (req, res) => {
    res.send({
        action: 'get one',
    })
})

router.post('/api/listings', (req, res) => {
    res.send({
        action: 'create one',
    })
})

router.patch('/api/listings', (req, res) => {
    res.send({
        action: 'update one',
    })
})

router.delete('/api/listings', (req, res) => {
    res.send({
        action: 'delete one',
    })
})

module.exports = {
    router,
}
