const Project = require('../models/project')
const Task = require('../models/task')

exports.store = async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        const project = await Project.create({
            title, description,
            user: req.userId 
        })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id})
            
            await projectTask.save()

            project.tasks.push(projectTask)
        }))

        // update task in project
        await project.save()

        return res.send({ project })

    } catch (e) {
        return res.status(400).send({ error: 'Error creating new project' })
    }
}

exports.index = async (req, res) => {
    try {
        const projects = await Project.find().populate('user')

        return res.send({ projects })

    } catch (e) {
        return res.status(400).send({ error: 'Error loading projects' })
    }
}

exports.show = async (req, res) => {
    try {
        const project = await Project.findById(
            req.params.id
        ).populate('user')

        return res.send({ project })

    } catch (e) {
        return res.status(400).send({ error: 'Error loading project' })
    }
}

exports.update = async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        const project = await Project.findByIdAndUpdate(req.params.id, {
            title, 
            description,
        }, { new: true })

        project.tasks = []
        await Task.remove({ project: project_id })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id})
            
            await projectTask.save()

            project.tasks.push(projectTask)
        }))

        await project.save()

        return res.send('Updated Successfully')

    } catch (e) {
        return res.status(400).send({ error: 'Error updating project' })
    }
}

exports.delete = async (req, res) => {
    try {
        await Project.findByIdAndRemove(
            req.params.id
        )

        return res.status(200).send('Successfully!!')

    } catch (e) {
        return res.status(400).send({ error: 'Error deleting project' })
    }
}
