const MARHALA_MAP = require('../utils/marhalaMapper');
const applyFilters = (results, marhala, juzzList) => {
    let filtered = [...results];
    if (marhala && MARHALA_MAP[marhala]) { const allowedJuzz = MARHALA_MAP[marhala]; filtered = filtered.filter(r => allowedJuzz.includes(r.juzz)); }
    if (juzzList && juzzList.length > 0) { const juzzInts = juzzList.map(Number); filtered = filtered.filter(r => juzzInts.includes(r.juzz)); }
    return filtered;
};
module.exports = { applyFilters };