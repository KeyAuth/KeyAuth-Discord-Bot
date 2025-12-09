const fs = require('fs');
const path = require('path');

const customDir = './tmp_db';
const customDbFile = 'test.sqlite';
const customPath = path.join(customDir, customDbFile);

// Set env var
process.env.DATABASE_PATH = customPath;

console.log('Testing with DATABASE_PATH =', customPath);

try {
    // Clean up before test
    if (fs.existsSync(customDir)) {
        fs.rmSync(customDir, { recursive: true, force: true });
    }

    const db = require('./utils/database.js');

    (async () => {
        try {
            await db.set('test_key', 'test_value');
            const val = await db.get('test_key');

            console.log('Read value:', val);

            if (val !== 'test_value') {
                console.error('FAILED: Value mismatch');
                process.exit(1);
            }

            if (!fs.existsSync(customPath)) {
                console.error('FAILED: Database file not created at custom path');
                process.exit(1);
            }

            console.log('SUCCESS: Database created at custom path and read/write works.');

            // Cleanup - skipped to avoid EBUSY on Windows if DB is open
            // fs.rmSync(customDir, { recursive: true, force: true });
            process.exit(0);
        } catch (innerErr) {
            console.error('Async Error:', innerErr);
            process.exit(1);
        }
    })();

} catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
}
