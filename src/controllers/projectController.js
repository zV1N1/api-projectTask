const Project = require('../models/project')
const User = require('../models/user')


exports.index = async (req, res) => {
    try {
        const projects = await Project.find({ 
            $or:[
                {admin: req.userId},
                {users: req.userId}
            ]
        })

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

exports.store = async (req, res) => {
    try {
        const { title, description } = req.body


        const project = await Project.create({
            title, description,
            admin: req.userId,
        })

        return res.send({ project })

    } catch (err) {
        return res.status(400).send({ error: err })
    }
}

exports.update = async (req, res) => {
    try {
        const { title, description } = req.body

        const project = await Project.findById(req.params.id)
        
        const isAdmin = project.admin == req.userId
        
        if (!isAdmin) {
            return res.status(400).send({ error: 'You are not admin' })
        }

        project.title = title 
        project.description = description

        const projectUpdated = await project.save()
        
        return res.send({ projectUpdated })

    } catch (err) {
        return res.status(400).send({ error: err })
    }
}

exports.delete = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id)
        
        const isAdmin = project.admin == req.userId
        
        if (!isAdmin) {
            return res.status(400).send({ error: 'You are not admin' })
        }
     
        const current = await project.remove()

        return res.status(200).send({ current })

    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project' })
    }
}


exports.addUser = async (req, res) => {
    try {
        const { username } = req.body

        const userExists = await User.findOne({ username })
        
        if (!userExists) {
            return res.status(400).send({ error: 'User does not exist!' })
        }
    
        const existsInProject = await Project.findOne({ users: userExists })

        if (existsInProject) {
            return res.status(400).send({ error: 'User already exists in the project!' })
        }

        const project = await Project.findById(req.params.id)

        project.users.push(userExists) 

        await project.save()

        return res.send({ project })
        //return res.send('User adding with success')
    } catch (err) {
        res.status(400).send({ error:  'Error in adding users' })
    }
}

