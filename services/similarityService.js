const SimilarityModel = require('../models/Similarity');
const AyahModel = require('../models/Ayah');
const { applyFilters } = require('./filterService');
const { formatError } = require('../utils/responseFormatter');

const fetchSimilarAyahs = async (surah, ayah, marhala, juzz) => {
    const sourceAyah = await AyahModel.getAyah(surah, ayah);
    if (!sourceAyah) throw formatError("Source Ayah not found", 404);
    
    let similarities = await SimilarityModel.getSimilarities(surah, ayah);
    
    // Parse tips from JSON string to array
    similarities = similarities.map(s => ({ ...s, tips: JSON.parse(s.tips || "[]") }));
    
    // Apply Marhala/Juzz filters
    const filteredResults = applyFilters(similarities, marhala, juzz);
    
    // Sort DESC by score
    filteredResults.sort((a, b) => b.similarity_score - a.similarity_score);
    
    // Return ALL results to frontend (do not filter out <50% here)
    const finalResults = filteredResults.map(r => ({
        ...r,
        highlight_mode: r.similarity_score >= 0.5 ? "similarities" : "differences",
        strength_label: r.similarity_score >= 0.8 ? "High" : r.similarity_score >= 0.5 ? "Medium" : "Low"
    }));
    
    return { source: sourceAyah, results: finalResults };
};

module.exports = { fetchSimilarAyahs };