const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("del")
        .setDescription("Delete a key")
        .addStringOption((option) => 
        option
            .setName("license")
            .setDescription("Specify key you would like deleted")
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})

        let key = interaction.options.getString("license")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=del&key=${key}&format=json`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Key Deleted:', `\`${key}\``).setColor("GREEN").setTimestamp()], ephemeral: true})
        }
        else
        {
            interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`).setColor("RED").setTimestamp()], ephemeral: true})
        }
        })
    },
};