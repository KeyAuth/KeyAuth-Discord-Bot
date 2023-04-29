const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delunused")
        .setDescription("Delete Unused Licenses")
		.setDescriptionLocalizations({
			"en-US": "Delete Unused Licenses",
			"fi": "Poista käyttämättömät lisenssit",
			"fr": "Supprimer les licences inutilisées",
			"de": "Unbenutzte Lizenzen löschen",
			"it": "Elimina licenze inutilizzate",
			"nl": "Verwijder ongebruikte licenties",
			"ru": "Удалить неиспользуемые лицензии",
			"pl": "Usuń nieużywane licencje",
			"tr": "Kullanılmayan Lisansları Sil",
			"cs": "Odstranit nepoužívané licence",
			"ja": "未使用のライセンスを削除する",
			"ko": "사용되지 않는 라이센스 삭제",
		}),
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
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})


        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delunused`)
        .then(res => res.json())
        .then(json => {
			if(json.success)
			{
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral})
			} else
			{
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`}]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})
			}
        })
    },
};