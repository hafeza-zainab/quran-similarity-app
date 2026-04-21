const express = require('express'); const router = express.Router();
const diaryController = require('../controllers/diaryController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/log', authMiddleware, diaryController.addLog);
router.get('/logs', authMiddleware, diaryController.getLogs);
router.post('/reflection', authMiddleware, diaryController.saveDailyReflection);
router.get('/reflection', authMiddleware, diaryController.getDailyReflection);
module.exports = router;