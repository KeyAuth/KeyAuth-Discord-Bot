const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userdata")
        .setDescription("Retrieve info from a user")
        .addStringOption((option) => 
        option
            .setName("user")
            .setDescription("Specify user to lookup")
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

        let user = interaction.options.getString("user")
        let hwid;
        let ip;
        let lastlogin;

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=userdata&user=${user}`)
        .then(res => res.json())
        .then(json => {
            if (!json.success) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            if (json.hwid == null) { hwid = null} else { hwid = json.hwid}
            if (json.ip == null) { ip = null} else { ip = json.ip}
			if (json.lastlogin == null) { lastlogin == null} else { lastlogin = `<t:${json.lastlogin}:f>`}
			interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(`User data for ${user}`).addField('Expiry:', `<t:${json['subscriptions'][0]['expiry']}:f>`).addField('Subscription name:', `${json['subscriptions'][0]['subscription']}`).addField('Last Login:', `${lastlogin}`).addField('HWID:', `${hwid}`).addField('Created On:', `<t:${json['createdate']}:f>`).addField('IP Address:', `${ip}`).setColor("BLUE").setTimestamp()], ephemeral: true})
        })
    },
};