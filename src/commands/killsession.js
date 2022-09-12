const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("killsessions")
        .setDescription("Kill All Existing Sessions")
        .setDescriptionLocalizations({
            "en-US": "Kill All Existing Sessions",
            "fi": "Tappaa kaikki olemassa olevat istunnot",
            "fr": "Tuez toutes les sessions existantes",
            "de": "Töten Sie alle vorhandenen Sitzungen",
            "it": "Uccidi tutte le sessioni esistenti",
            "nl": "Dood alle bestaande sessies",
            "ru": "Убейте все существующие сеансы",
            "pl": "Zabij wszystkie istniejące sesje",
            "tr": "Tüm Mevcut Oturumları Öldürün",
            "cs": "Zabijte všechny existující relace",
            "ja": "すべての既存のセッションを終了する",
            "ko": "모든 기존 세션 죽이기",
        }),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=killall`)
        .then(res => res.json())
        .then(json => {
            if (json.success)
            {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Successfully Killed All Sessions").setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            } else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};