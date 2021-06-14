const router = require('express').Router()
const crypt = require('../util/crypt')
const mail = require('../util/mail')
const usersRepo = require('../repos/users')
const Joi = require('joi')

const SIGNINERROR = 'There was a problem signing in check email and password'
const INTERNALERROR = 'Oops something went wrong contact support'
const NOTVERIFIEDERROR = 'Email has not been verified check your inbox'
const EMAILALREADYINUSE = 'Email has already been assosiated with an account'

const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    validated: Joi.boolean().required(),
    token: Joi.string(),
})

router.post('/signup', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const encrypted = password ? await crypt.hashPassword(password) : undefined

    const newUser = {
        name: name,
        password: encrypted,
        email: email,
        validated: false,
        token: crypt.generateToken(),
    }
    try {
        await schema.validateAsync(newUser)
    } catch (error) {
        return res.send({ message: error.message })
    }

    const exsistingUser = await usersRepo.readOne({ email: email })
    if (exsistingUser && exsistingUser.validated) {
        return res.status(409).send({ message: EMAILALREADYINUSE })
    } else if (exsistingUser && !exsistingUser.validated) {
        const sentMail = await mail.sendConfirmation(exsistingUser.email, exsistingUser.token)
        if (!sentMail) {
            return res.status(500).send({ message: INTERNALERROR })
        }
        return res.status(409).send({ message: NOTVERIFIEDERROR })
    }

    const addedUser = await usersRepo.createOne(newUser)
    if (!addedUser) {
        return res.status(500).send({ message: INTERNALERROR })
    }

    const sentMail = await mail.sendConfirmation(newUser.email, newUser.token)
    if (!sentMail) {
        return res.status(500).send({ message: INTERNALERROR })
    }

    res.status(201).send({ success: true })
})

// TODO: delete token after validation
router.post('/signin', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const token = req.body.token

    const exsistingUser = await usersRepo.readOne({ email: email })
    if (!exsistingUser) {
        return res.status(404).send({ message: SIGNINERROR })
    }

    if (!exsistingUser.validated) {
        if (token !== exsistingUser.token) {
            const sentMail = await mail.sendConfirmation(exsistingUser.email, exsistingUser.token)
            if (!sentMail) {
                return res.status(500).send({ message: INTERNALERROR })
            }
            return res.status(401).send({ message: NOTVERIFIEDERROR })
        }
        const result = await usersRepo.updateOne(exsistingUser._id, { validated: true })
        if (!result) {
            return res.status(500).send({ message: INTERNALERROR })
        }
    }

    const result = await crypt.comparePassword(password, exsistingUser.password)

    if (!result) {
        res.status(404).send({ message: SIGNINERROR })
    }

    req.session.isAuth = true
    req.session.userId = exsistingUser._id
    req.session.userName = exsistingUser.name
    req.session.isAdmin = exsistingUser.admin
    return res.status(201).send({ success: true })
})

router.get('/signout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = { router }
