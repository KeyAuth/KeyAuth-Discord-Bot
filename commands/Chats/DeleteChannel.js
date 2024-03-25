const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-channel")
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
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let name = interaction.options.getString("name")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delchannel&name=${name}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                }
            })
    },
};