const fs = require("fs");
const config = require("./utils/config.js") || { token: null, DevelopmentServerId: null, type: "development" };

const db = require('./utils/database')
const fetch = require('node-fetch')
const { REST, Client, GatewayIntentBits, ActivityType, Collection, EmbedBuilder, Routes, Partials, Colors } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ],
    partials: [Partials.Channel]
});

/* const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
} */

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

    console.log({
        commands,
        clientCommands
    })
}

readCommandsFromDirectory("./commands");

client.on("error", console.error);

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.once('ready', async () => {
    console.clear();
    console.log("Bot Online");
    console.log("Logged in as:", client.user.tag)

    const CLIENT_ID = client.user.id;

    const rest = new REST().setToken(config.token);
    /* 
        let comds = commands.map(x => x.name)
        console.log(`Commands: ${comds}`) */

    (async () => {
        try {
            if (config.type === "production") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Commands have been added to Global Usage.")
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, config.DevelopmentServerId), {
                    body: commands
                })
                console.log(`Commands have been added as Guild Only Usage.`)
            }
        } catch (err) {
            console.error({
                raw: err.rawError,
                errors: err["rawError"]["errors"]
            });
        }

        /*    rest.put(Routes.applicationGuildCommands(CLIENT_ID, config.DevelopmentServerId), { body: [] })
       .then(() => console.log('Successfully deleted all guild commands.'))
       .catch(console.error);
   
   rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
       .then(() => console.log('Successfully deleted all application commands.'))
       .catch(console.error); */
    })();

    await setPresence(client, `mazkdevf_bot`, { type: ActivityType.Competing, status: 'online' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.type === 2) return;

    const command = clientCommands.get(interaction.commandName);

    if (!command) return;

    let idfrom = null;
    let ephemeral = true;

    if (interaction.guild == null) {
        idfrom = interaction.user.id;
        ephemeral = false;
    }
    else {
        idfrom = interaction.guild.id;
    }

    await interaction.deferReply({ ephemeral: ephemeral });

    if (interaction.member != null)
        if (!interaction.member.roles.cache.find(x => x.name == "perms")) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`You need a role with the name \`perms\` to execute commands. Please ask an administrator to create a role with this name if not already done and assign it to you.`).setColor(Colors.Red).setTimestamp()], ephemeral: true })

    await setPresence(client, `mazkdevf_bot`, { type: ActivityType.Competing, status: 'online' });

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
                .setAuthor({ name: "Interaction Failed" })
                .setColor(Colors.Red)
                .setTimestamp()
                .setFooter({ text: "mazkdevf_bot Discord Bot", iconURL: client.user.displayAvatarURL() })],
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

client.login(config.token);
