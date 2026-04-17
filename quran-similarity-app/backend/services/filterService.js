const MARHALA_MAP = require('../utils/marhalaMapper');

const applyFilters = (results, marhala, juzzList) => {
    let filtered = [...results];

    // Step 1: Apply Marhala Filter
    if (marhala && MARHALA_MAP[marhala]) {
        const allowedJuzz = MARHALA_MAP[marhala];
        filtered = filtered.filter(r => allowedJuzz.includes(r.juzz));
    }

    // Step 2: Apply Juzz Filter (if specific juzz selected)
    if (juzzList && juzzList.length > 0) {
        const juzzInts = juzzList.map(Number);
        filtered = filtered.filter(r => juzzInts.includes(r.juzz));
    }

    return filtered;
};

module.exports = { applyFilters };