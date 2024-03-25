const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban-user")
        .setDescription("Ban user")
        .setDescriptionLocalizations({
            "en-US": "Ban user",
            "fi": "Estä käyttäjä",
            "fr": "Bannir l'utilisateur",
            "de": "Benutzer sperren",
            "it": "Banna l'utente",
            "nl": "Blokkeer gebruiker",
            "ru": "Забанить пользователя",
            "pl": "Zbanuj użytkownika",
            "tr": "Kullanıcıyı yasakla",
            "cs": "Zakázat uživatele",
            "ja": "ユーザーを禁止する",
            "ko": "사용자를 금지하다",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("User you wish to ban")
                .setDescriptionLocalizations({
                    "en-US": "User you wish to ban",
                    "fi": "Käyttäjä, jonka haluat estää",
                    "fr": "Utilisateur que vous souhaitez bannir",
                    "de": "Benutzer, den Sie sperren möchten",
                    "it": "Utente che desideri bannare",
                    "nl": "Gebruiker die u wilt blokkeren",
                    "ru": "Пользователь, которого вы хотите забанить",
                    "pl": "Użytkownik, którego chcesz zbanować",
                    "tr": "Yasaklamak istediğiniz kullanıcı",
                    "cs": "Uživatel, kterého chcete zakázat",
                    "ja": "禁止したいユーザー",
                    "ko": "금지하려는 사용자",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for the ban")
                .setDescriptionLocalizations({
                    "en-US": "Reason for the ban",
                    "fi": "Syy bannille",
                    "fr": "Raison du bannissement",
                    "de": "Grund für die Sperrung",
                    "it": "Motivo del ban",
                    "nl": "Reden voor de ban",
                    "ru": "Причина бана",
                    "pl": "Powód banowania",
                    "tr": "Yasaklama nedeni",
                    "cs": "Důvod pro zakázání",
                    "ja": "禁止の理由",
                    "ko": "금지의 이유",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")
        let reason = interaction.options.getString("reason")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=banuser&user=${user}&reason=${reason}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                }
            })
    },
};