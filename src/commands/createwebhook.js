const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createwebhook")
        .setDescription("Add webhook to application")
        .addStringOption((option) => 
        option
            .setName("baseurl")
            .setDescription("URL that's hidden on KeyAuth server")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("useragent")
            .setDescription("User agent, optional. If not set, it will default to KeyAuth")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("authed")
            .setDescription("Determines whether user needs to be logged in (1) or not (0)")
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.reply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})

        let baseurl = interaction.options.getString("baseurl")
        let useragent = interaction.options.getString("useragent")
        let authed = interaction.options.getString("authed")

        if(isNaN(authed))
        {
            return interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle('Failure, non-numerical answer provided.').setColor("RED")], ephemeral: true})
        }

        if (baseurl.includes("http://") || baseurl.includes("https://"))
        { } else {
            return interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle("Failure, Please Include `http:\/\/` or `https:\/\/` on webhook link").setColor("RED").setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true })
        }

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addwebhook&baseurl=${baseurl}&ua=${useragent}&authed=${authed}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).setColor("GREEN").setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            } else {
                interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};