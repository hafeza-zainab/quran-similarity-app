const express = require('express'); const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/charts', authMiddleware, analyticsController.getChartsData);
router.get('/juzz-history', authMiddleware, analyticsController.getJuzzHistory);
module.exports = router;