const fs = require("fs");
const db = require('quick.db')
const fetch = require('node-fetch')
const { REST } = require("@discordjs/rest");
const { Client, GatewayIntentBits, ActivityType, Collection, EmbedBuilder, Routes, Partials, Colors } = require("discord.js");
const { token, DevelopmentServerId, type } = require("./config.json");
const { no_perms, error_embed } = require("./responses.json");
const Discord = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ],
    partials: [Partials.Channel]
})

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.on("error", console.error);

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.once('ready', async() => {
    console.clear();
    console.log("Bot Online");
    console.log("Logged in as:", client.user.tag)

    const CLIENT_ID = client.user.id;

    const rest = new REST({
        version: "10"
    }).setToken(token);

    (async () => {
        try {
            if (type === "production") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Commands have been added to Global Usage.")
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, DevelopmentServerId), {
                    body: commands
                })
                console.log(`Commands have been added as Guild Only Usage.`)
            }
        } catch (err) {
            console.error(err);
        }
    })();

    client.user.setPresence({
		activities: [{ name: `keyauth.cc`, type: ActivityType.Competing }],
		status: 'online',
	});

});

client.on('interactionCreate', async interaction => {
    if (!interaction.type === 2) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await interaction.deferReply({ ephemeral: true });
	
	if(interaction.member != null)
	if(!interaction.member.roles.cache.find(x => x.name == "perms")) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(no_perms.response[interaction.locale] || no_perms.response['default']).setColor(Colors.Red).setTimestamp()], ephemeral: true})

    const ErrorEmbed = new EmbedBuilder()
    .setAuthor({ name: "Interaction Failed" })
    .setColor(Colors.Red)
    .setTimestamp()
    .setFooter({ text: "KeyAuth Discord Bot", iconURL: client.user.displayAvatarURL()})

    client.user.setPresence({
		activities: [{ name: `keyauth.cc`, type: ActivityType.Competing }],
		status: 'online',
	});

	let idfrom = null;
	
	if(interaction.guild == null)
		idfrom = interaction.user.id;
	else
		idfrom = interaction.guild.id;
	
	let content = `**${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.user.id})** executed the command \`/${interaction.commandName}\`\n`;
	
	for (var i = 0; i < interaction.options._hoistedOptions.length; i++) {
    content += "\n" + interaction.options._hoistedOptions[i].name + " : " + interaction.options._hoistedOptions[i].value;
	}
	
	let wh_url = await db.get(`wh_url_${idfrom}`)
	if(wh_url != null) {
		var params = {
			// content: `**${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.user.id})** executed the command \`/${interaction.commandName}\`\n\nwith the paramaters:\`${JSON.stringify(interaction.options._hoistedOptions)}\``
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
    } catch(err) {
        if (err) console.error(err);

        await interaction.editReply({
            embeds: [ErrorEmbed],
            ephemeral: true
        })
    }
});

client.login(token);