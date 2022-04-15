const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Application Statistics"),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.reply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=stats`)
        .then(res => res.json())
        .then(json => {
			if(json.success) {
				interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle('Application Statistics').addField('Unused Keys:', `${json['unused']}`).addField('Used Keys:', `${json['used']}`).addField('Paused Keys:', `${json['paused']}`).addField('Banned Keys:', `${json['banned']}`).addField('Total Keys:', `${json['totalkeys']}`).addField('Webhooks:', `${json['webhooks']}`).addField('Files:', `${json['files']}`).addField('Vars:', `${json['vars']}`).addField('Reseller Accounts:', `${json['resellers']}`).addField('Manager Accounts:', `${json['managers']}`).addField('Total Accounts:', `${json['totalaccs']}`).setColor("BLUE").setTimestamp()], ephemeral: true})
			}
			else {
				interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
			}
        })

    },
};