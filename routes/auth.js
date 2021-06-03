const router = require('express').Router()
const crypt = require('../util/crypt')
const mail = require('../util/mail')
const usersRepo = require('../repos/users')

/* TODO:
 ** Delete user after some time, if not validated
 ** TOTHINK:
 ** What if hash returns error?
 ** What if email can't be sent?
 */

router.post('/signup', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    const newUser = {
        name: name,
        password: await crypt.hashPassword(password),
        email: email,
        validated: false,
        token: crypt.generateToken(),
    }

    const exsistingUser = await usersRepo.readOne({ email: email })
    if (exsistingUser && exsistingUser.validated) {
        return res.status(409).send({ message: 'Email is already assosiated with an account' })
    } else if (exsistingUser && !exsistingUser.validated) {
        const sentMail = await mail.sendConfirmation(exsistingUser.email, exsistingUser.token)
        if (!sentMail) {
            return res.status(500).send({ message: 'Error sending comfirmation email' })
        }
        return res.status(409).send({ message: 'Email is not confirmed please check inbox' })
    }

    const addedUser = await usersRepo.createOne(newUser)
    if (!addedUser) {
        return res.status(500).send({ message: 'Error adding user' })
    }

    const sentMail = await mail.sendConfirmation(newUser.email, newUser.token)
    if (!sentMail) {
        return res.status(500).send({ message: 'Error sending comfirmation email' })
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
        return res.status(404).send({ message: 'Could not find user with this email' })
    }

    if (!exsistingUser.validated) {
        if (token !== exsistingUser.token) {
            const sentMail = await mail.sendConfirmation(exsistingUser.email, exsistingUser.token)
            if (!sentMail) {
                return res.status(500).send({ message: 'Error sending comfirmation email' })
            }
            return res.status(401).send({ message: 'User is not validated ' })
        }
        const result = await usersRepo.updateOne(exsistingUser._id, { validated: true })
        if (!result) {
            return res.status(500).send({ message: 'Could update user' })
        }
    }

    const result = await crypt.comparePassword(password, exsistingUser.password)
    if (result) {
        req.session.isAuth = true
        req.session.userId = exsistingUser._id
        req.session.isAdmin = exsistingUser.admin
        return res.status(201).send({ success: true })
    }

    res.status(204).send({ message: 'Password incorrect' })
})

router.get('/signout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = { router }
