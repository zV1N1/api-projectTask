const mongoose = require('../database')

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [3, 'The Title must be at least three characters'],
        maxLength: [40, 'Maximum 40 characters']
    },
    description: {
        type: String,
        required: true,
        minLength: [3, 'The Description must be at least three characters'],
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],

    createdAt: {
        type: Date,
        dafault: Date.now,
    },
})

ProjectSchema.post('save', function(error, doc, next) {

    const message = error.errors
 
    for (const key in message) {
        let name = key
        if (error) {   
            next( message[name].message ) 
        } 
    }
    next()
});


const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project