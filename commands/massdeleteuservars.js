const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../utils/database')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("massuservardelete")
        .setDescription("Delete All User Variables With Name")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("The name of the subscription.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = null;
		let ephemeral = true;
		
		if(interaction.guild == null) {
			idfrom = interaction.user.id;
			ephemeral = false;
		}
		else {
			idfrom = interaction.guild.id;
		}
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let name = interaction.options.getString("name")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=massUserVarDelete&name=${name}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'User variable deleted:', value: `\`${name}\`` }]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.` }]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};