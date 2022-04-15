const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setseller")
        .setDescription("Sets The seller key")
        .addStringOption((option) => 
        option
            .setName("sellerkey")
            .setDescription("Specify application seller key")
            .setRequired(true)
        ),
    async execute(interaction) {

    let sellerkey = interaction.options.getString("sellerkey")

    fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setseller`)
    .then(res => res.json())
    .then(json => {
    if(json.success)
    {
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		db.fetch(`token_${idfrom}`)
		db.set(`token_${idfrom}`, sellerkey)
		interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle('Seller Key Successfully Set!').setColor("GREEN").setTimestamp()], ephemeral: true})
    }
    else
    {
		interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
    }
    })
    },
};