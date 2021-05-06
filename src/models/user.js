const mongoose = require('../database')
const bcrypt = require('bcryptjs')

const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, 'The Name must be at least three characters']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username required'],
        lowercase: true,
        minLength: [3, 'The Name must be at least three characters']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    }, 
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [3, 'The Password must be at least three characters']
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
        default: Date.now,
    },
})

Userschema.post('save', function(error, doc, next) {

    const message = error.errors
 
    for (const key in message) {
        let name = key
        if (error) {   
            next( message[name].message ) 
        } 
    }
    next()
});

Userschema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 8)
    this.password = hash

    next()
}) 

const User = mongoose.model('User', Userschema)

module.exports = User