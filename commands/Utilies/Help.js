const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command for bot")
    .setDescriptionLocalizations({
      "en-US": "Help command for bot",
      "fi": "Ohje-komento bottia varten",
      "fr": "Commande d'aide pour le bot",
      "de": "Hilfsbefehl für den Bot",
      "it": "Comando di aiuto per il bot",
      "nl": "Helpcommando voor bot",
      "ru": "Команда справки для бота",
      "pl": "Polecenie pomocy dla bota",
      "tr": "Bot için yardım komutu",
      "cs": "Příkaz nápovědy pro bota",
      "ja": "ボットのヘルプコマンド",
      "ko": "봇의 도움말 명령",
    }),
  async execute(interaction) {
    let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
    let ephemeral = !interaction.guild ? false : true;

    const embed = new EmbedBuilder()
      .setTitle(`KeyAuth help menu`)
      .addFields([
        { name: '_ _', value: 'This bot is for the open-source authentication system [KeyAuth](https://keyauth.cc)\n\nIf you\'re using the cloud hosted version of KeyAuth, you\'ll need the seller plan to use. You can test before purchase by using the demo seller account in the #demo-accounts channel of the [Discord server](https://discord.gg/keyauth)' },
        { name: 'Source code:', value: `[https://github.com/KeyAuth/KeyAuth-Discord-Bot](https://github.com/KeyAuth/KeyAuth-Discord-Bot)` },
        { name: 'Library', value: "Discord.JS v14.14.1" },
        { name: 'Tutorial video', value: '[https://www.youtube.com/watch?v=tngShw2Vmm0](https://www.youtube.com/watch?v=tngShw2Vmm0)' }
      ])
      .setColor(Colors.Blue)
      .setTimestamp();

    interaction.editReply({ embeds: [embed], ephemeral: ephemeral })
  },
};