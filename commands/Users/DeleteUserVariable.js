const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-user-variable")
        .setDescription("Delete user variable")
        .setDescriptionLocalizations({
            "en-US": "Delete user variable",
            "fi": "Poista käyttäjän muuttuja",
            "fr": "Supprimer la variable utilisateur",
            "de": "Benutzervariable löschen",
            "it": "Elimina variabile utente",
            "nl": "Gebruikersvariabele verwijderen",
            "ru": "Удалить переменную пользователя",
            "pl": "Usuń zmienną użytkownika",
            "tr": "Kullanıcı değişkenini sil",
            "cs": "Odstranit uživatelskou proměnnou",
            "ja": "ユーザー変数を削除",
            "ko": "사용자 변수 삭제",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Username of user variable you wish to delete")
                .setDescriptionLocalizations({
                    "en-US": "Username of user variable you wish to delete",
                    "fi": "Poistettavan käyttäjän muuttujan käyttäjätunnus",
                    "fr": "Nom d'utilisateur de la variable utilisateur que vous souhaitez supprimer",
                    "de": "Benutzername der Benutzervariable, die Sie löschen möchten",
                    "it": "Nome utente della variabile utente che si desidera eliminare",
                    "nl": "Gebruikersnaam van de gebruikersvariabele die u wilt verwijderen",
                    "ru": "Имя пользователя переменной пользователя, которую вы хотите удалить",
                    "pl": "Nazwa użytkownika zmiennej użytkownika, którą chcesz usunąć",
                    "tr": "Silmek istediğiniz kullanıcı değişkeninin kullanıcı adı",
                    "cs": "Uživatelské jméno uživatelské proměnné, kterou chcete odstranit",
                    "ja": "削除したいユーザー変数のユーザー名",
                    "ko": "삭제하려는 사용자 변수의 사용자 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Name of user variable you wish to delete")
                .setDescriptionLocalizations({
                    "en-US": "Name of user variable you wish to delete",
                    "fi": "Poistettavan käyttäjän muuttujan nimi",
                    "fr": "Nom de la variable utilisateur que vous souhaitez supprimer",
                    "de": "Name der Benutzervariable, die Sie löschen möchten",
                    "it": "Nome della variabile utente che si desidera eliminare",
                    "nl": "Naam van de gebruikersvariabele die u wilt verwijderen",
                    "ru": "Имя переменной пользователя, которую вы хотите удалить",
                    "pl": "Nazwa zmiennej użytkownika, którą chcesz usunąć",
                    "tr": "Silmek istediğiniz kullanıcı değişkeninin adı",
                    "cs": "Název uživatelské proměnné, kterou chcete odstranit",
                    "ja": "削除したいユーザー変数の名前",
                    "ko": "삭제하려는 사용자 변수의 이름",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")
        let name = interaction.options.getString("name")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=deluservar&user=${user}&var=${name}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'User variable deleted:', value: `\`${name}\`` }]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.` }]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};