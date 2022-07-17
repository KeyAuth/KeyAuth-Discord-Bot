const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setvar")
        .setDescription("Assign variable to user(s)")
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("User variable name")
            .setRequired(true)
        )
		.addStringOption((option) => 
        option
            .setName("data")
            .setDescription("User variable data")
            .setRequired(true)
        )
		.addStringOption((option) => 
        option
            .setName("user")
            .setDescription("User to set variable of. If you leave blank, all users will be assigned user variable")
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let name = interaction.options.getString("name")
        let data = interaction.options.getString("data")
        let user = interaction.options.getString("user") ?? "all"
		
        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setvar&user=${user}&var=${name}&data=${data}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            } else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};