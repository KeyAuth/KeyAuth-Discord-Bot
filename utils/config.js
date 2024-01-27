const fs = require("fs");
const config =
    fs.existsSync(__dirname + "/../config.json")
        ? validateConfig(require("../config.json"))
        : (() => {
            require("dotenv").config();

            const token = process.env.TOKEN;
            const developmentServerId = process.env.DEVELOPMENT_SERVER_ID;
            const type = process.env.TYPE || "development";

            if (type != "production") {
                if (!developmentServerId) {
                    throw new Error("Missing Development Server Id!")
                }
            }

            if (!token) {
                throw new Error("Missing required environment variables: TOKEN, DEVELOPMENT_SERVER_ID, TYPE");
            }

            return {
                token,
                DevelopmentServerId: developmentServerId,
                type,
            };
        })();

function validateConfig(config) {
    const { token, DevelopmentServerId, type } = config;

    if (type != "production") {
        if (!DevelopmentServerId) {
            throw new Error("Missing Development Server Id from config.json")
        }
    }

    if (!token) {
        throw new Error("Missing required token from config.json!");
    }

    return config;
}

module.exports = config;