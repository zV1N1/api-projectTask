const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypt = require('crypto')
const sendEmail = require('../services/mailer')

const authConfig = require('../config/auth.json')
const User = require('../models/User')


exports.store = async (req, res) => {
    const { email } = req.body
    try {
        const userAlreadyExists = await User.findOne({
            email,
        })
        if (userAlreadyExists) {
            return res.status(400).send({ error: 'User already exists' })
        }
        
        const user = await User.create(req.body)
        user.password = undefined

        return res.send({ user })

    } catch (err) {
        res.status(400).send({ error: 'Registration failed' })
        
    }   
}

exports.auth = async (req, res) => {
    const { email, password  } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        res.status(400).send({ error: "User not Found"})
    }

    if(!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: "Invalid password" })
    }

    user.password = undefined

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
    })

    res.send({ user, token })
}

exports.forgot_password = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            res.status(400).send({ error: "User not Found"})
        }

        const token = crypt.randomBytes(20).toString('hex')
        //console.log(token)

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        }, { new: true, useFindAndModify: false })

        const variables = {
            name: user.name,
            token
        }

        sendEmail(email, variables)

        return res.status(201).send('ok')
        
    } catch (e) {
        res.status(400).send({ error: 'Erro on forgot password, try again' })
    }
}

exports.reset_password = async (req, res) => {
    const { email, token, newPassword } = req.body

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')

        if (!user) {
            return res.status(400).send({ error: 'User not found' })
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Token invalid' })
        }

        const now = new Date()

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' })


        user.password = newPassword

        await user.save()
        
        return res.send('ok')
    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password, try again' })
    }
}
