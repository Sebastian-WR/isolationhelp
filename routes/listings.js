const router = require('express').Router()
const listingsRepo = require('../db/repos/listings')

router.get('/api/listings', async (req, res) => {
    let listings = await listingsRepo.readOneOrMore()
    if (listings.length > 0) {
        console.log('Listings found')
        return res.send({ listings })
    }
    console.log('No listings found')
    res.send({ error })
})

router.get('/api/listings/:id', async (req, res) => {
    const id = req.params.id
    let listing = await listingsRepo.readOne(id)
    if (listing) {
        console.log('Listing found')
        return res.send({ listing })
    }
    console.log('Listing missing')
    res.send({ error })
})

router.post('/api/listings', async (req, res) => {
    const doc = req.body
    let success = await listingsRepo.createOne(doc)
    if (success) {
        console.log('Listing created')
        return res.send({ success })
    }
    console.log('No listings created')
    res.send({ error })
})

router.patch('/api/listings/:id', async (req, res) => {
    const id = req.params.id
    const fields = req.body
    let success = await listingsRepo.updateOne(id, fields)
    if (success) {
        console.log('Listing updated')
        return res.send({ success })
    }
    console.log('No listings found')
    res.send({ error })
})

router.delete('/api/listings/:id', async (req, res) => {
    const id = req.params.id
    let success = await listingsRepo.deleteOne(id)
    if (success) {
        console.log('Listing deleted', id)
        return res.send({ success })
    }
    console.log('No listings found')
    res.send({ error })
})

module.exports = {
    router,
}
