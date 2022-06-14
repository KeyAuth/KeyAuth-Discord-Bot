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

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=userdata&user=${user}`)
        .then(res => res.json())
        .then(json => {
            if (!json.success) return interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(json.message).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`).setColor("RED").setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
			let hwid = json.hwid ?? "N/A";
			let ip = json.ip ?? "N/A";
			let lastlogin = (json.lastlogin !== null && json.lastlogin !== undefined) ? `<t:${json.lastlogin}:f>` : "N/A";
			let expiry = "N/A";
			let subscription = "N/A";
			if (json.subscriptions.length !== 0) {
				expiry = (json.subscriptions[0].expiry !== null && json.subscriptions[0].expiry !== undefined) ? `<t:${json['subscriptions'][0]['expiry']}:f>` : "N/A";
				subscription = (json.subscriptions[0].subscription !== null && json.subscriptions[0].subscription !== undefined) ? json.subscriptions[0].subscription : "N/A";
			}
			interaction.editReply({ embeds: [new Discord.MessageEmbed().setTitle(`User data for ${user}`).addField('Expiry:', `${expiry}`).addField('Subscription name:', `${subscription}`).addField('Last Login:', `${lastlogin}`).addField('HWID:', `${hwid}`).addField('Created On:', `<t:${json['createdate']}:f>`).addField('IP Address:', `${ip}`).setColor("BLUE").setTimestamp()], ephemeral: true})
        })
    },
};