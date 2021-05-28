const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

const saltRounds = 10

const hashPassword = async (plainText) => {
    let result
    try {
        const hash = await bcrypt.hash(plainText, saltRounds)
        result = hash
    } catch (error) {
        return new Error('Could not hash password')
    }
    return result
}

const comparePassword = async (plainText, hashed) => {
    let result
    try {
        const response = await bcrypt.compare(plainText, hashed)
        result = response
    } catch (error) {
        return new Error('Could compare password')
    }
    return result
}

const generateToken = () => {
    return uuidv4()
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
}
