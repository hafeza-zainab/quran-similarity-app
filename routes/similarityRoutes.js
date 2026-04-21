const express = require('express'); const router = express.Router();
const similarityController = require('../controllers/similarityController');
router.get('/', similarityController.getSimilarities);
module.exports = router;