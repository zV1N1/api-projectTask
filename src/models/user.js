const mongoose = require('../database')
const bcrypt = require('bcryptjs')

const Userschema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        require: Date.now,
    },
})

Userschema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 8)
    this.password = hash

    next()
}) 

const User = mongoose.model('User', Userschema)

module.exports = User