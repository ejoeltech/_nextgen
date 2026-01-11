const fs = require('fs');
const path = require('path');

console.log('🧹 NextGen Data Reset Script');
console.log('============================\n');

// Paths
const dataDir = path.join(__dirname, '..', 'data');
const fliersDir = path.join(__dirname, '..', 'public', 'conference-fliers');

// Function to reset a JSON file
function resetJsonFile(filePath, defaultData) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
        console.log(`✅ Reset: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error resetting ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

// Function to delete files in a directory
function clearDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            console.log(`⚠️  Directory doesn't exist: ${dirPath}`);
            return true;
        }

        const files = fs.readdirSync(dirPath);
        let deletedCount = 0;

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });

        console.log(`✅ Deleted ${deletedCount} file(s) from ${path.basename(dirPath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error clearing directory ${dirPath}:`, error.message);
        return false;
    }
}

// Initial referral codes (50 codes)
const initialReferralCodes = Array.from({ length: 50 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
        code: `NGN${num}`,
        ownerName: `User ${num}`,
        ownerPhone: `+234 80${num} 000 00${num}`,
        createdAt: new Date().toISOString()
    };
});

console.log('Starting data reset...\n');

let success = true;

// 1. Reset conferences
console.log('1️⃣  Resetting conferences...');
success = resetJsonFile(path.join(dataDir, 'conferences.json'), []) && success;

// 2. Reset attendance/registrations
console.log('\n2️⃣  Resetting registrations...');
success = resetJsonFile(path.join(dataDir, 'attendance.json'), []) && success;

// 3. Reset referral codes to initial 50
console.log('\n3️⃣  Resetting referral codes...');
success = resetJsonFile(path.join(dataDir, 'referral-codes.json'), initialReferralCodes) && success;

// 4. Clear uploaded fliers
console.log('\n4️⃣  Clearing uploaded fliers...');
success = clearDirectory(fliersDir) && success;

// Summary
console.log('\n============================');
if (success) {
    console.log('✅ Data reset completed successfully!');
    console.log('\nReset summary:');
    console.log('  • Conferences: 0');
    console.log('  • Registrations: 0');
    console.log('  • Referral Codes: 50 (reset to initial)');
    console.log('  • Flier Images: Cleared');
} else {
    console.log('⚠️  Data reset completed with some errors. Check the output above.');
}

console.log('\n💡 Tip: Restart your development server to see the changes.');
