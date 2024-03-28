const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retrieve-user-variable")
        .setDescription("Retrieve user variable")
        .setDescriptionLocalizations({
            "en-US": "Retrieve user variable",
            "fi": "Hae käyttäjän muuttuja",
            "fr": "Récupérer la variable utilisateur",
            "de": "Benutzervariable abrufen",
            "it": "Recupera variabile utente",
            "nl": "Gebruikersvariabele ophalen",
            "ru": "Получить переменную пользователя",
            "pl": "Pobierz zmienną użytkownika",
            "tr": "Kullanıcı değişkenini al",
            "cs": "Získejte uživatelskou proměnnou",
            "ja": "ユーザー変数を取得する",
            "ko": "사용자 변수 검색",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Username of user you want to retrieve user variable from")
                .setDescriptionLocalizations({
                    "en-US": "Username of user you want to retrieve user variable from",
                    "fi": "Käyttäjän käyttäjätunnus, jolta haluat hakea käyttäjän muuttujan",
                    "fr": "Nom d'utilisateur de l'utilisateur dont vous souhaitez récupérer la variable utilisateur",
                    "de": "Benutzername des Benutzers, von dem Sie die Benutzervariable abrufen möchten",
                    "it": "Nome utente dell'utente da cui si desidera recuperare la variabile utente",
                    "nl": "Gebruikersnaam van de gebruiker waarvan u de gebruikersvariabele wilt ophalen",
                    "ru": "Имя пользователя пользователя, переменную которого вы хотите получить",
                    "pl": "Nazwa użytkownika użytkownika, z którego chcesz pobrać zmienną użytkownika",
                    "tr": "Kullanıcı değişkenini almak istediğiniz kullanıcının kullanıcı adı",
                    "cs": "Uživatelské jméno uživatele, ze kterého chcete získat uživatelskou proměnnou",
                    "ja": "ユーザー変数を取得したいユーザーのユーザー名",
                    "ko": "사용자 변수를 검색하려는 사용자의 사용자 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Name of user variable you want to retrieve")
                .setDescriptionLocalizations({
                    "en-US": "Name of user variable you want to retrieve",
                    "fi": "Haluamasi käyttäjän muuttujan nimi",
                    "fr": "Nom de la variable utilisateur que vous souhaitez récupérer",
                    "de": "Name der Benutzervariable, die Sie abrufen möchten",
                    "it": "Nome della variabile utente che si desidera recuperare",
                    "nl": "Naam van de gebruikersvariabele die u wilt ophalen",
                    "ru": "Имя переменной пользователя, которую вы хотите получить",
                    "pl": "Nazwa zmiennej użytkownika, którą chcesz pobrać",
                    "tr": "Almak istediğiniz kullanıcı değişkeninin adı",
                    "cs": "Název uživatelské proměnné, kterou chcete získat",
                    "ja": "取得したいユーザー変数の名前",
                    "ko": "검색하려는 사용자 변수의 이름",
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

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=getvar&user=${user}&var=${name}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`User variable successfully retrieved`).addFields([{ name: 'Variable data:', value: `\`${json['response']}\`` }]).setColor(Colors.Blue).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};