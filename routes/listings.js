const router = require('express').Router()
const listingsRepo = require('../db/repos/listings')

router.get('/api/listings', async (req, res) => {
    let listings = await listingsRepo.readOneOrMore()
    if (listings.length > 0) {
        console.log('Listings found')
    } else {
        console.log('No listings found')
    }
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
