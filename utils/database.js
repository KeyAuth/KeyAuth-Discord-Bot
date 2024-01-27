// This file is used to create a database instance for the bot to use.
const { QuickDB } = require("quick.db");
const db = new QuickDB();
module.exports = db;