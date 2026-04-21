const express = require('express');
const router = express.Router();
const ayahController = require('../controllers/ayahController');

router.get('/surahs', ayahController.getSurahs);
router.get('/:surah/ayahs', ayahController.getAyahsBySurah);
router.get('/context', ayahController.getAyahContext); // NEW ROUTE

module.exports = router;