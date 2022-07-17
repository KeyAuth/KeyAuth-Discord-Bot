const { SlashCommandBuilder, Colors } = require("discord.js");
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
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let key = interaction.options.getString("license")
        let hwid;
        let ip;

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=info&key=${key}`)
        .then(res => res.json())
        .then(json => {
            if (!json.success) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            if (json.hwid == null) { hwid == null} else { }
            if (json.ip == null) { ip == null} else { }

            const embed = new Discord.EmbedBuilder()
            .setTitle(`Key Information for ${key}`)
            .addFields([
                { name: 'Expiry:', value: `${json['expiry']}` }, 
                { name: 'Last Login:', value: `${json['lastlogin']}` },
                { name: 'HWID:', value: `${hwid}` },
                { name: 'Status:', value: `${json['status']}` },
                { name: 'Level:', value: `${json['level']}` },
                { name: 'Created By:', value: `${json['createdby']}` },
                { name: 'Created On:', value: `${json['creationdate']}` },
                { name: 'IP Address:', value: `${ip}` }
            ])
            .setColor(Colors.Blue)
            .setTimestamp()

            interaction.editReply({ embeds: [embed], ephemeral: true});
        })
    },
};