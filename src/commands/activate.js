const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("activate")
        .setDescription("Activate License Key")
        .addStringOption((option) => 
        option
            .setName("username")
            .setDescription("Enter username to register")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("license")
            .setDescription("Enter Valid License")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("password")
            .setDescription("Enter Password")
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})
    
        let un = interaction.options.getString("username")
        let pw = interaction.options.getString("password")
        let key = interaction.options.getString("license")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=activate&user=${un}&key=${key}&pass=${pw}&format=text`)
        .then(res => res.json())
        .then(json => {
		if(json.success) {
			interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('License Successfully Activated!').addFields([{ name: 'License Activated:', value: `${key}`}]).setColor(Colors.Green).setTimestamp()], ephemeral: true})
        }
		else
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`}]).setColor(Colors.Red).setTimestamp()], ephemeral: true})
        }
		})
    },
};