const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify-user")
        .setDescription("Verify user exists")
        .setDescriptionLocalizations({
            "en-US": "Verify user exists",
            "fi": "Tarkista, että käyttäjä on olemassa",
            "fr": "Vérifier que l'utilisateur existe",
            "de": "Überprüfen, ob Benutzer existiert",
            "it": "Verifica che l'utente esista",
            "nl": "Controleer of gebruiker bestaat",
            "ru": "Проверить, существует ли пользователь",
            "pl": "Sprawdź, czy użytkownik istnieje",
            "tr": "Kullanıcının olup olmadığını doğrulayın",
            "cs": "Ověřte, zda uživatel existuje",
            "ja": "ユーザーが存在することを確認します",
            "ko": "사용자가 존재하는지 확인하십시오",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Username of user you would like to check the existence of")
                .setDescriptionLocalizations({
                    "en-US": "Username of user you would like to check the existence of",
                    "fi": "Käyttäjän käyttäjätunnus, jonka olemassaolon haluat tarkistaa",
                    "fr": "Nom d'utilisateur de l'utilisateur dont vous souhaitez vérifier l'existence",
                    "de": "Benutzername des Benutzers, dessen Existenz Sie überprüfen möchten",
                    "it": "Nome utente dell'utente di cui desideri verificare l'esistenza",
                    "nl": "Gebruikersnaam van de gebruiker waarvan u de bestaande wilt controleren",
                    "ru": "Имя пользователя пользователя, существование которого вы хотите проверить",
                    "pl": "Nazwa użytkownika użytkownika, którego istnienie chcesz sprawdzić",
                    "tr": "Varlığını kontrol etmek istediğiniz kullanıcının kullanıcı adı",
                    "cs": "Uživatelské jméno uživatele, jehož existenci chcete ověřit",
                    "ja": "存在を確認したいユーザーのユーザー名",
                    "ko": "존재 여부를 확인하려는 사용자의 사용자 이름",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=verifyuser&user=${user}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'User exists:', value: `\`${user}\`` }]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.` }]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};