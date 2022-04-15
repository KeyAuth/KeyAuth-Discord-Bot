const { SlashCommandBuilder } = require("@discordjs/builders");
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
        if(sellerkey === null) return interaction.reply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})
        var keylist = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallkeys&format=text`;
		
		fetch(keylist)
        .then(res => res.json())
        .then(json => {
				if (json.success)
				{
					interaction.reply({
					embeds: [new Discord.MessageEmbed().setAuthor({ name: "KeyAuth Keys" }).setFooter({ text: "KeyAuth Discord Bot" }).setColor("GREEN").setTimestamp()],
					files: [{
						attachment: keylist,
						name: 'keys.txt'
					}],
					ephemeral: true
					})
				}
				else
				{
					return interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
				}
        })
    },
};