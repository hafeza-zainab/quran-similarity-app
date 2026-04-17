const { fetchSimilarAyahs } = require('../services/similarityService');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

exports.getSimilarities = async (req, res, next) => {
    try {
        const { surah, ayah, marhala, juzz } = req.query;

        if (!surah || !ayah) {
            return res.status(400).json(formatError("Surah and Ayah are required"));
        }

        // Parse juzz if it comes as comma-separated string (e.g., "1,2")
        const juzzArray = juzz ? juzz.split(',') : [];

        const data = await fetchSimilarAyahs(
            parseInt(surah), 
            parseInt(ayah), 
            marhala, 
            juzzArray
        );

        if (data.results.length === 0) {
            return res.status(200).json(formatSuccess(data, "No similarities found for selected filters."));
        }

        res.status(200).json(formatSuccess(data));
    } catch (error) {
        next(error);
    }
};