const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController')
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/TaskController');

const authMiddleware = require('../middlewares/auth');



// auth
router.post('/register', authController.store)
router.post('/auth', authController.auth)
router.post('/forgot_password', authController.forgot_password)
router.post('/reset_password', authController.reset_password)


router.get('/index', authController.index)


// project
router.get('/project', authMiddleware, projectController.index)
router.get('/project/:id', authMiddleware, projectController.show)

router.post('/project', authMiddleware, projectController.store)
router.post('/project/user/:id', projectController.addUser)
router.put('/project/:id', authMiddleware, projectController.update)
router.delete('/project/:id', authMiddleware, projectController.delete)

// task
router.post('/project/task/:id', authMiddleware, taskController.store)
router.get('/project/task/:id', authMiddleware, taskController.show)

module.exports = router;