const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("delete-all-licenses")
		.setDescription("Delete All Licenses"),
	async execute(interaction) {
		let idfrom = null;
		let ephemeral = true;

		if (interaction.guild == null) {
			idfrom = interaction.user.id;
			ephemeral = false;
		}
		else {
			idfrom = interaction.guild.id;
		}

		let sellerkey = await db.get(`token_${idfrom}`)
		if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

		fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delalllicenses`)
			.then(res => res.json())
			.then(json => {
				if (json.success) {
					interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
				} else {
					interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
				}
			})
	},
};