const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delblack")
        .setDescription("Delete blacklist")
        .addStringOption((option) => 
        option
            .setName("ip")
            .setDescription("IP Address you want to remove from blacklist")
            .setRequired(false)
        )
        .addStringOption((option) => 
        option
            .setName("hwid")
            .setDescription("Hardware-ID you want to remove from blacklist")
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let ip = interaction.options.getString("ip")
        let hwid = interaction.options.getString("hwid")
		
		if(!ip && !hwid) {
			return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`You need to either define hwid or ip paramater. Please try again defining one of these paramaters..`).setColor(Colors.Red).setTimestamp()], ephemeral: true})
		}
		if(ip && hwid) {
			return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`Please only define one paramater per command..`).setColor(Colors.Red).setTimestamp()], ephemeral: true})
		}
		
		let url = null;
		if(ip) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delblack&data=${ip}&blacktype=ip`;
		if(hwid) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delblack&data=${hwid}&blacktype=hwid`;

        fetch(url)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            }
        })
    },
};