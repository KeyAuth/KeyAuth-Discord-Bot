const dotenv = require("dotenv");
dotenv.config();

const { TOKEN, DEVELOPMENT_SERVER_ID, TYPE } = process.env;

if (!TOKEN || !DEVELOPMENT_SERVER_ID || !TYPE) {
    throw new Error("Missing required environment variables: TOKEN, DEVELOPMENT_SERVER_ID, TYPE");
}

const config = {
    token: TOKEN,
    DevelopmentServerId: DEVELOPMENT_SERVER_ID,
    type: TYPE || "development"
};

if (config.type !== "production" && !config.DevelopmentServerId) {
    throw new Error("Missing Development Server Id!");
}

module.exports = config;