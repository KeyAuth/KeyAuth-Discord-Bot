const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("download")
        .setDescription("Download all keys"),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})
        var keylist = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallkeys&format=text`;
					interaction.editReply({
					embeds: [new Discord.EmbedBuilder().setAuthor({ name: "KeyAuth Keys" }).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
					files: [{
						attachment: keylist,
						name: 'keys.txt'
					}],
					ephemeral: true
					})
    },
};
