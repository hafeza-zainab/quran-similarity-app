// backend/scripts/resetDB.js
// THE ONLY SCRIPT YOU NEED TO RUN WHEN UPDATING TIPS
const { execSync } = require('child_process');
const path = require('path');

console.log('===================================');
console.log('🔄 STARTING FULL DATABASE RESET...');
console.log('===================================\n');

const scriptsDir = path.resolve(__dirname);

try {
    console.log('1/3 Creating fresh tables...');
    execSync('node setupDatabase.js', { cwd: scriptsDir, stdio: 'inherit' });
    
    console.log('\n2/3 Importing base Quran text...');
    execSync('node importQuran.js', { cwd: scriptsDir, stdio: 'inherit' });
    
    console.log('\n3/3 Importing Similarities from unique_pairs.json...');
    execSync('node importFinalSimilarities.js', { cwd: scriptsDir, stdio: 'inherit' });
    
    console.log('\n===================================');
    console.log('✅ ALL DONE! Backend is ready.');
    console.log('===================================');
} catch (error) {
    console.error('\n❌ Reset failed at one of the steps. Check the errors above.');
}