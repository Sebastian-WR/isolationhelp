const router = require('express').Router()

router.post('/signup', (req, res) => {
    const result = req.body.email
    console.log('got this from form!', result)
    res.send({ message: 'signup user', result })
})

router.post('/signin', (req, res) => {
    const result = req.body.email
    console.log('got this from form!', result)
    res.send({ message: 'signin user', result })
})

module.exports = { router }
