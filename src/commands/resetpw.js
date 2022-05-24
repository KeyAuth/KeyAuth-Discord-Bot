const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetpw")
        .setDescription("Reset password of user")
        .addStringOption((option) => 
        option
            .setName("user")
            .setDescription("Username of user you're resetting password of")
            .setRequired(true)
        )
		.addStringOption((option) => 
        option
            .setName("pass")
            .setDescription("Password for user (optional) if not set, will be set later on login")
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp()], ephemeral: true})

        let user = interaction.options.getString("user")
        let pass = interaction.options.getString("pass")

		let url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetpw&user=${user}&passwd=${pass}`
		if(!pass)
			url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetpw&user=${user}`
		
        fetch(url)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).setColor("GREEN").setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            } else {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};