const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delchannel")
        .setDescription("Delete chat channel")
        .setDescriptionLocalizations({
            "en-US": "Delete chat channel",
            "fi": "Poista keskustelukanava",
            "fr": "Supprimer le canal de discussion",
            "de": "Chat-Kanal löschen",
            "it": "Elimina canale di chat",
            "nl": "Chatkanaal verwijderen",
            "ru": "Удалить чат-канал",
            "pl": "Usuń kanał czatu",
            "tr": "Sohbet kanalını sil",
            "cs": "Odstranit chatovací kanál",
            "ja": "チャットチャネルを削除する",
            "ko": "채팅 채널 삭제",
        })
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("Chat channel name")
            .setDescriptionLocalizations({
                "en-US": "Chat channel name",
                "fi": "Keskustelukanavan nimi",
                "fr": "Nom du canal de discussion",
                "de": "Name des Chat-Kanals",
                "it": "Nome del canale di chat",
                "nl": "Naam van chatkanaal",
                "ru": "Имя чат-канала",
                "pl": "Nazwa kanału czatu",
                "tr": "Sohbet kanalı adı",
                "cs": "Název chatovacího kanálu",
                "ja": "チャットチャネル名",
                "ko": "채팅 채널 이름",
            })
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

        let name = interaction.options.getString("name")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delchannel&name=${name}`)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            }
        })
    },
};