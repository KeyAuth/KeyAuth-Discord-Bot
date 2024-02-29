const config =
(() => {
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

module.exports = config;