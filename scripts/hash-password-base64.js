// Generate base64-encoded password hash for Windows compatibility
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter admin password: ', async (password) => {
    if (!password || password.length < 8) {
        console.error('❌ Password must be at least 8 characters long');
        rl.close();
        return;
    }

    const hash = await bcrypt.hash(password, 10);
    const base64Hash = Buffer.from(hash).toString('base64');

    console.log('\n✅ Password hash generated successfully!\n');
    console.log('Add this to your .env.local file:\n');
    console.log(`ADMIN_USERNAME=admin`);
    console.log(`ADMIN_PASSWORD_HASH_BASE64=${base64Hash}`);
    console.log(`JWT_SECRET=${generateRandomSecret()}\n`);

    console.log('Original hash (for reference):');
    console.log(hash);
    console.log('\nBase64 encoded:');
    console.log(base64Hash);

    rl.close();
});

function generateRandomSecret() {
    return require('crypto').randomBytes(32).toString('base64');
}
