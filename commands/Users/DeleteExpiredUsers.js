const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-expired-users")
        .setDescription("Delete users with no active subscriptions")
        .setDescriptionLocalizations({
            "en-US": "Delete users with no active subscriptions",
            "fi": "Poista käyttäjät, joilla ei ole aktiivisia tilauksia",
            "fr": "Supprimer les utilisateurs sans abonnement actif",
            "de": "Benutzer mit keinem aktiven Abonnement löschen",
            "it": "Elimina gli utenti senza sottoscrizioni attive",
            "nl": "Gebruikers met geen actieve abonnementen verwijderen",
            "ru": "Удалить пользователей без активных подписок",
            "pl": "Usuń użytkowników bez aktywnych subskrypcji",
            "tr": "Aktif abonelik olmayan kullanıcıları sil",
            "cs": "Odstranit uživatele bez aktivních předplatných",
            "ja": "アクティブなサブスクリプションのないユーザーを削除する",
            "ko": "활성 구독이없는 사용자 삭제",
        }),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delexpusers`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};