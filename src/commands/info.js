const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Info On key")
        .addStringOption((option) => 
        option
            .setName("license")
            .setDescription("Specify key")
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
        let hwid;
        let ip;

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=info&key=${key}`)
        .then(res => res.json())
        .then(json => {
            if (!json.success) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            if (json.hwid == null) { hwid == null} else { }
            if (json.ip == null) { ip == null} else { }
            interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(`Key Information for ${key}`).addField('Expiry:', `${json['expiry']}`).addField('Last Login:', `${json['lastlogin']}`).addField('HWID:', `${hwid}`).addField('Status:', `${json['status']}`).addField('Level:', `${json['level']}`).addField('Created By:', `${json['createdby']}`).addField('Created On:', `${json['creationdate']}`).addField('IP Address:', `${ip}`).setColor("BLUE").setTimestamp()], ephemeral: true})
        })
    },
};