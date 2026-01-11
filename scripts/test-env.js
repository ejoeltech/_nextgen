// Quick test to check if environment variables are loaded
console.log('=== Environment Variables Check ===');
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME ? 'SET' : 'NOT SET');
console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? 'SET (length: ' + process.env.ADMIN_PASSWORD_HASH.length + ')' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('===================================');
