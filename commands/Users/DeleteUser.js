const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-user")
        .setDescription("Delete user")
        .setDescriptionLocalizations({
            "en-US": "Delete user",
            "fi": "Poista käyttäjä",
            "fr": "Supprimer l'utilisateur",
            "de": "Benutzer löschen",
            "it": "Elimina utente",
            "nl": "Verwijder gebruiker",
            "ru": "Удалить пользователя",
            "pl": "Usuń użytkownika",
            "tr": "Kullanıcıyı sil",
            "cs": "Smazat uživatele",
            "ja": "ユーザーを削除する",
            "ko": "사용자 삭제",
        })
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Enter Username")
                .setDescriptionLocalizations({
                    "en-US": "Enter Username",
                    "fi": "Anna käyttäjätunnus",
                    "fr": "Entrez le nom d'utilisateur",
                    "de": "Geben Sie den Benutzernamen ein",
                    "it": "Inserisci il nome utente",
                    "nl": "Voer gebruikersnaam in",
                    "ru": "Введите имя пользователя",
                    "pl": "Wprowadź nazwę użytkownika",
                    "tr": "Kullanıcı adını girin",
                    "cs": "Zadejte uživatelské jméno",
                    "ja": "ユーザー名を入力してください",
                    "ko": "사용자 이름을 입력하십시오",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let un = interaction.options.getString("username")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=deluser&user=${un}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })

    },
};