const SimilarityModel = require('../models/Similarity');
const AyahModel = require('../models/Ayah');
const { applyFilters } = require('./filterService');
const { formatError } = require('../utils/responseFormatter');

const fetchSimilarAyahs = async (surah, ayah, marhala, juzz) => {
    // 1. Check if source ayah exists
    const sourceAyah = await AyahModel.getAyah(surah, ayah);
    if (!sourceAyah) {
        throw formatError("Source Ayah not found", 404);
    }

    // 2. Get raw similarities from DB
    let similarities = await SimilarityModel.getSimilarities(surah, ayah);
    
    // 3. Parse JSON tips
    similarities = similarities.map(s => ({
        ...s,
        tips: JSON.parse(s.tips || "[]")
    }));

    // 4. Apply Filters (Marhala / Juzz)
    const filteredResults = applyFilters(similarities, marhala, juzz);

    // 5. Sort DESC by similarity score
    filteredResults.sort((a, b) => b.similarity_score - a.similarity_score);

    // 6. Add UI specific flags (>= 50% highlight similarities, else differences)
    const finalResults = filteredResults.map(r => ({
        ...r,
        highlight_mode: r.similarity_score >= 0.5 ? "similarities" : "differences",
        strength_label: r.similarity_score >= 0.8 ? "High" : r.similarity_score >= 0.5 ? "Medium" : "Low"
    }));

    return {
        source: sourceAyah,
        results: finalResults
    };
};

module.exports = { fetchSimilarAyahs };