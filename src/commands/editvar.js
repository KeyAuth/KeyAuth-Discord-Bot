const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editvar")
        .setDescription("Edit Variable")
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("Variable Name?")
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("value")
            .setDescription("Variable Value?")
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

        let varname = interaction.options.getString("name")
        let varvalue = interaction.options.getString("value")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=editvar&varid=${varname}&data=${varvalue}`)
        .then(res => res.json())
        .then(json => {
			if (json.success)
            {
				interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).setColor("GREEN").setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};