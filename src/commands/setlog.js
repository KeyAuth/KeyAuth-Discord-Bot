const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlog")
        .setDescription("Sets a Discord webhook to log commands used on this bot.")
        .addStringOption((option) => 
        option
            .setName("webhook")
            .setDescription("Discord webhook URL")
            .setRequired(true)
        ),
    async execute(interaction) {

    let webhook = interaction.options.getString("webhook")
	
	let idfrom = null;
	if(interaction.guild == null)
		idfrom = interaction.user.id;
	else
		idfrom = interaction.guild.id;
	
	db.fetch(`wh_url_${idfrom}`)
	db.set(`wh_url_${idfrom}`, webhook)
    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('Successfully set discord webhook to log commands to').setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
	
    },
};