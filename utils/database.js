// This file is used to create a database instance for the bot to use.
const { QuickDB } = require("quick.db");
const path = require("path");
const fs = require("fs");

// Use DATABASE_PATH env var if set, otherwise default to ./json.sqlite
// This maintains backwards compatibility while adding flexibility for deployments (e.g. Coolify)
const dbPath = process.env.DATABASE_PATH || "./json.sqlite";

if (process.env.DATABASE_PATH) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const db = new QuickDB({ filePath: dbPath });
module.exports = db;