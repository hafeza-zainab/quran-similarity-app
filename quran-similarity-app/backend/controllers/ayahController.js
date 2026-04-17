const AyahModel = require('../models/Ayah');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

exports.getSurahs = async (req, res, next) => {
    try {
        const surahs = await AyahModel.getAllSurahs();
        res.status(200).json(formatSuccess(surahs));
    } catch (error) {
        next(error);
    }
};

exports.getAyahsBySurah = async (req, res, next) => {
    try {
        const { surah } = req.params;
        const ayahs = await AyahModel.getAyahsBySurah(surah);
        res.status(200).json(formatSuccess(ayahs));
    } catch (error) {
        next(error);
    }
};