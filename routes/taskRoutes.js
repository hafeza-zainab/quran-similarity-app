const express = require('express'); const router = express.Router();
const taskController = require('../controllers/taskController');
const streakController = require('../controllers/streakController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/streak', authMiddleware, streakController.getStreak);
router.post('/', authMiddleware, taskController.createTask);
router.get('/', authMiddleware, taskController.getTasks);
router.patch('/:id', authMiddleware, taskController.updateTask);
router.put('/:id', authMiddleware, taskController.editTaskTitle); // PUT for editing
router.delete('/:id', authMiddleware, taskController.deleteTask); // DELETE for deleting

module.exports = router;