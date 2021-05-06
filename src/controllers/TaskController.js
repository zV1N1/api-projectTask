const Project = require('../models/project')
const Task = require('../models/task')
const User = require('../models/user')

exports.store = async (req, res) => {
    try {
         const { title, description, assignedTo } = req.body               
         
         const project = await Project.findById(req.params.id)
         
         const usersInProject = project.users

         const userExists = await User.findOne({ username: assignedTo }).select('_id')
         
         if ( !userExists || !usersInProject.includes(userExists._id)) {
            return res.status(400).send({ error: 'User does exists in project' })
         }

         const newTasks = new Task({
                  title, 
                  description,
                  assignedTo: userExists,
                  projectId: req.params.id, 
               })

         await newTasks.save()

         project.tasks.push(newTasks)

         await project.save()
         
         return res.send({ project })
     } catch (err) {
        return res.status(400).send({ error: 'Error in creating new task!' })
     }
}

exports.show = async (req, res) => {
   try {
      const tasks = await Task.find({ projectId: req.params.id })
         .populate('assignedTo')
         
      res.send({ tasks })
   } catch (err) {
      console.log(err)
      return res.status(400).send('Error')
   }
}