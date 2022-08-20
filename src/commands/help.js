const { SlashCommandBuilder, Colors } = require("discord.js");
const Discord = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command for bot"),
  async execute(interaction) {
    const embed = new Discord.EmbedBuilder()
    .setTitle(`KeyAuth help menu`)
    .addFields([
      { name: '_ _', value: 'This bot is for the open-source authentication system [KeyAuth](https://keyauth.win)\n\nIf you\'re using the cloud hosted version of KeyAuth, you\'ll need the seller plan to use. You can test before purchase by using the demo seller account in the #demo-accounts channel of the [Discord server](https://discord.gg/keyauth)'},
      { name: 'Source code:', value: `[https://github.com/KeyAuth/KeyAuth-Discord-Bot](https://github.com/KeyAuth/KeyAuth-Discord-Bot)`},
      { name: 'Library', value: "Discord.JS v14.0.1"},
      { name: 'Tutorial video', value: '[https://www.youtube.com/watch?v=orQ_5BQCd-U](https://www.youtube.com/watch?v=orQ_5BQCd-U)'}
    ])
    .setColor(Colors.Blue)
    .setTimestamp();

    interaction.editReply({ embeds: [embed], ephemeral: true })
  },
};
