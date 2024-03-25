const fs = require("fs");
const config = require("./utils/config.js") || {
    token: null,
    DevelopmentServerId: null,
    type: "development"
};

const db = require('./utils/database')
const fetch = require('node-fetch')
const {
    REST,
    Client,
    GatewayIntentBits,
    ActivityType,
    Collection,
    EmbedBuilder,
    Routes,
    Partials,
    Colors
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ],
    partials: [Partials.Channel]
});

const commands = [];
const clientCommands = new Collection();

function readCommandsFromDirectory(directory) {
    const commandFiles = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of commandFiles) {
        if (file.isDirectory()) {
            readCommandsFromDirectory(`${directory}/${file.name}`);
        } else if (file.isFile() && file.name.endsWith(".js")) {
            const command = require(`${directory}/${file.name}`);
            commands.push(command.data.toJSON());
            clientCommands.set(command.data.name, command);
        }
    }
}

readCommandsFromDirectory("./commands");

client.on("error", console.error);

process.on('unhandledRejection', error => {
    console.error('Encountered an unhandled promise rejection', error);
});

client.once('ready', async () => {
    console.clear();
    console.log("Bot is now online.");
    console.log("Currently signed in as:", client.user.tag)

    const CLIENT_ID = client.user.id;

    const rest = new REST().setToken(config.token);

    (async () => {
        try {
            if (config.type === "production") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Commands have been incorporated for Global Usage.")
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, config.DevelopmentServerId), {
                    body: commands
                })
                console.log(`Command access is now restricted to guild members.`)
            }
        } catch (err) {
            console.error({
                rawError: err.rawError,
                Errors: err["rawError"]["errors"]
            });
        }
    })();

    await setPresence(client, `KeyAuth.cc`, { type: ActivityType.Competing, status: 'online' });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("selectapp_")) {
            const id = interaction.customId.split("_")[1];
            const idFromGuild = interaction.guild ? interaction.guild.id : interaction.user.id;
            const applications = await db.get(`applications_${idFromGuild}`) || [];

            if (applications.length === 0) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("No applications have been added yet.")
                            .setColor(Colors.Red)
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            const selectedApp = applications.find(app => app.id === id);

            if (!selectedApp) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("The selected application does not exist.")
                            .setColor(Colors.Red)
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            db.get(`token_${idFromGuild}`);
            db.set(`token_${idFromGuild}`, selectedApp.sellerkey);

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`The application \`${selectedApp.application}\` has been selected.`)
                        .setColor(Colors.Green)
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }

        return false;
    }

    if (!interaction.type === 2) return;

    const command = clientCommands.get(interaction.commandName);

    if (!command) return;

    let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
    let ephemeral = !interaction.guild ? false : true;


    await interaction.deferReply({ ephemeral: ephemeral });

    if (interaction.member != null)
        if (!interaction.member.roles.cache.find(x => x.name == "perms")) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`You need a role with the name \`perms\` to execute commands. Please ask an administrator to create a role with this name if not already done and assign it to you.`).setColor(Colors.Red).setTimestamp()], ephemeral: true })

    await setPresence(client, `KeyAuth.cc`, { type: ActivityType.Competing, status: 'online' });

    let content = `**${interaction.user.username}${interaction.user.discriminator ? ("#" + interaction.user.discriminator) : ''} (ID: ${interaction.user.id})** executed the command \`/${interaction.commandName}\`\n`;

    for (const option of interaction.options._hoistedOptions) {
        content += `\n${option.name} : ${option.value}`;
    }

    let wh_url = await db.get(`wh_url_${idfrom}`)
    if (wh_url != null) {
        var params = {
            content: content
        }
        fetch(wh_url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(params)
        })
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        if (err) console.error(err);

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setAuthor({ name: "Interaction was unsuccessful." })
                .setColor(Colors.Red)
                .setTimestamp()
                .setFooter({ text: "KeyAuth Discord Bot", iconURL: client.user.displayAvatarURL() })],
            ephemeral: true
        })
    }
});

async function setPresence(client, text, options = { type: ActivityType.Competing, status: 'online' }) {
    client.user.setPresence({
        activities: [{ name: text, type: options.type }],
        status: options.status,
    });
}

client.login(config.token).catch(err => {
    console.clear();
    if (err.code === "TokenInvalid") {
        console.error("The provided token is invalid. Please review your config.json file or check the Environment Variables if you're not using a JSON config, and attempt again.");
        process.exit(1);
    }
})
