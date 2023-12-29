const fs = require("fs");
const config =
    fs.existsSync(__dirname + "/../config.json")
        ? validateConfig(require("../config.json"))
        : (() => {
            require("dotenv").config();

            const token = process.env.TOKEN;
            const developmentServerId = process.env.DEVELOPMENT_SERVER_ID;
            const type = process.env.TYPE || "development";

            if (!token || !developmentServerId) {
                throw new Error("Missing required environment variables: TOKEN, DEVELOPMENT_SERVER_ID, TYPE");
            }

            return {
                token,
                DevelopmentServerId: developmentServerId,
                type,
            };
        })();

function validateConfig(config) {
    const { token, DevelopmentServerId } = config;

    if (!token || !DevelopmentServerId) {
        throw new Error("Missing required properties in config.json: token, DevelopmentServerId, type");
    }

    return config;
}

module.exports = config;