const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("assign-user-variable")
        .setDescription("Assign a variable to user(s)")
        .setDescriptionLocalizations({
            "en-US": "Assign a variable to user(s)",
            "fi": "Määritä muuttuja käyttäjälle",
            "fr": "Assigner une variable à l'utilisateur",
            "de": "Variablen einem Benutzer zuweisen",
            "it": "Assegna variabile all'utente",
            "nl": "Wijs variabele toe aan gebruiker(s)",
            "ru": "Назначить переменную пользователю",
            "pl": "Przypisz zmienną do użytkownika",
            "tr": "Değişkeni kullanıcıya ata",
            "cs": "Přiřadit proměnnou uživateli",
            "ja": "変数をユーザーに割り当てる",
            "ko": "변수를 사용자에게 할당",
        })
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Enter the user variable name.")
                .setDescriptionLocalizations({
                    "en-US": "User variable name",
                    "fi": "Käyttäjän muuttujan nimi",
                    "fr": "Nom de la variable utilisateur",
                    "de": "Benutzervariablenname",
                    "it": "Nome variabile utente",
                    "nl": "Gebruikersvariabelenaam",
                    "ru": "Имя переменной пользователя",
                    "pl": "Nazwa zmiennej użytkownika",
                    "tr": "Kullanıcı değişkeni adı",
                    "cs": "Název uživatelské proměnné",
                    "ja": "ユーザー変数名",
                    "ko": "사용자 변수 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("data")
                .setDescription("Enter the user variable data.")
                .setDescriptionLocalizations({
                    "en-US": "Enter the user variable data",
                    "fi": "Käyttäjän muuttujan tiedot",
                    "fr": "Données de la variable utilisateur",
                    "de": "Benutzervariablen-Daten",
                    "it": "Dati variabili utente",
                    "nl": "Gebruikersvariabelengegevens",
                    "ru": "Данные переменной пользователя",
                    "pl": "Dane zmiennej użytkownika",
                    "tr": "Kullanıcı değişkeni verileri",
                    "cs": "Uživatelské proměnné",
                    "ja": "ユーザー変数データ",
                    "ko": "사용자 변수 데이터",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Enter the user to set variable for, or leave blank for all users.")
                .setDescriptionLocalizations({
                    "en-US": "User to set variable for, or leave blank for all users",
                    "fi": "Käyttäjä asettaa muuttujan, tai jätä tyhjäksi kaikille käyttäjille",
                    "fr": "Utilisateur pour définir la variable, ou laisser vide pour tous les utilisateurs",
                    "de": "Benutzer zum Festlegen der Variablen, oder leer lassen für alle Benutzer",
                    "it": "Utente per impostare la variabile, o lascia vuoto per tutti gli utenti",
                    "nl": "Gebruiker om variabele voor in te stellen, of leeg laten voor alle gebruikers",
                    "ru": "Пользователь для установки переменной, или оставьте пустым для всех пользователей",
                    "pl": "Użytkownik do ustawienia zmiennej, lub pozostaw puste dla wszystkich użytkowników",
                    "tr": "Değişkeni ayarlayacak kullanıcı, veya tüm kullanıcılar için boş bırakın",
                    "cs": "Uživatel k nastavení proměnné, nebo ponechte prázdné pro všechny uživatele",
                    "ja": "変数を設定するユーザー、またはすべてのユーザーのために空白のままにします",
                    "ko": "변수를 설정할 사용자, 또는 모든 사용자에 대해 비워 둡니다",
                })
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("readonly")
                .setDescription("Should the user variable be read only? (0 = no, 1 = yes)")
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let name = interaction.options.getString("name")
        let data = interaction.options.getString("data")
        let user = interaction.options.getString("user") ?? "all"
        let readOnly = interaction.options.getInteger("readonly") ?? 0

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setvar&user=${user}&var=${name}&data=${data}&readOnly=${readOnly}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};
