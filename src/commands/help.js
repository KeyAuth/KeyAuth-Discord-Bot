const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help command for bot"),
    async execute(interaction) {
		interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(`KeyAuth help menu`).addField('_ _', 'This bot is for the open-source authentication system [KeyAuth](https://keyauth.win)\n\nIf you\'re using the cloud hosted version of KeyAuth, you\'ll need the seller plan to use. You can test before purchase by using the demo seller account in the #demo-accounts channel of the [Discord server](https://discord.gg/auth)').addField('Source code:', `[https://github.com/KeyAuth/KeyAuth-Discord-Bot](https://github.com/KeyAuth/KeyAuth-Discord-Bot)`).addField('Library', 'Discord.js').addField('Tutorial video', '[https://www.youtube.com/watch?v=orQ_5BQCd-U](https://www.youtube.com/watch?v=orQ_5BQCd-U)').setColor("BLUE").setTimestamp()], ephemeral: true})
    },
};
