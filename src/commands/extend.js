const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("extend")
        .setDescription("Extend User")
        .addStringOption((option) => 
        option
            .setName("username")
            .setDescription("Enter username to extend")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("subname")
            .setDescription("Enter Subscription Name")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("expiry")
            .setDescription("Enter Days Subscription Should Last")
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


        let un = interaction.options.getString("username")
        let subname = interaction.options.getString("subname")
        let days = interaction.options.getString("expiry")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=extend&user=${un}&name=${subname}&expiry=${days}`)
        .then(res => res.json())
        .then(json => {
			if (json.success)
            {
				interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('User Extended:', `${un}`).setColor("GREEN").setTimestamp()], ephemeral: true})
			} else {
                interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};