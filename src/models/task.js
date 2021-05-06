const mongoose = require('../database')

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [3, 'The Title must be at least three characters'],
        maxLength: [40, 'Maximum 40 characters']
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    description: {
        type: String,
        required: true,
        minLength: [3, 'The Description must be at least three characters']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


const Task = mongoose.model('Task', TaskSchema)

module.exports = Task