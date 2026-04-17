const express = require('express');
const router = express.Router();
const ayahController = require('../controllers/ayahController');

router.get('/surahs', ayahController.getSurahs);
router.get('/:surah/ayahs', ayahController.getAyahsBySurah);

module.exports = router;