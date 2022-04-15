const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addblack")
        .setDescription("Add blacklist")
        .addStringOption((option) => 
        option
            .setName("ip")
            .setDescription("IP Address you want to blacklist")
            .setRequired(false)
        )
        .addStringOption((option) => 
        option
            .setName("hwid")
            .setDescription("Hardware-ID you want to blacklist")
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.reply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})

        let ip = interaction.options.getString("ip")
        let hwid = interaction.options.getString("hwid")
		
		if(!ip && !hwid) {
			return interaction.reply({ embeds: [new Discord.MessageEmbed().setDescription(`You need to either define hwid or ip paramater. Please try again defining one of these paramaters..`).setColor("RED").setTimestamp()], ephemeral: true})
		}
		if(ip && hwid) {
			return interaction.reply({ embeds: [new Discord.MessageEmbed().setDescription(`Please only define one paramater per command..`).setColor("RED").setTimestamp()], ephemeral: true})
		}
		
		let url = null;
		if(ip) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=black&ip=${ip}`;
		if(hwid) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=black&hwid=${hwid}`;

        fetch(url)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).setColor("GREEN").setTimestamp()], ephemeral: true})
			} else {
                interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            }
        })
    },
};