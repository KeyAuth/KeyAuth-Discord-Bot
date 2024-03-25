const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("assign-user-variable")
        .setDescription("Assign variable to user(s)")
        .setDescriptionLocalizations({
            "en-US": "Assign variable to user(s)",
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
                .setDescription("User variable name")
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
                .setDescription("User variable data")
                .setDescriptionLocalizations({
                    "en-US": "User variable data",
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
                .setDescription("User to set variable of. If you leave blank, all users will be assigned user variable")
                .setDescriptionLocalizations({
                    "en-US": "User to set variable of. If you leave blank, all users will be assigned user variable",
                    "fi": "Käyttäjä asettaa muuttujan. Jätä tyhjäksi kaikille käyttäjille",
                    "fr": "L'utilisateur doit définir la variable de. Laisser vide pour tous les utilisateurs",
                    "de": "Benutzer zum Festlegen der Variablen. Für alle Benutzer leer lassen",
                    "it": "Utente di cui impostare la variabile. Lascia vuoto per tutti gli utenti",
                    "nl": "Gebruiker om variabele van in te stellen. Leeg laten voor alle gebruikers",
                    "ru": "Пользователь для установки переменной. Оставьте пустым для всех пользователей",
                    "pl": "Użytkownik do ustawienia zmiennej. Pozostaw puste dla wszystkich użytkowników",
                    "tr": "Değişkeni ayarlayacak kullanıcı. Tüm kullanıcılar için boş bırakın",
                    "cs": "Uživatel k nastavení proměnné. Ponechte prázdné pro všechny uživatele",
                    "ja": "変数を設定するユーザー。空のままにすると、すべてのユーザーにユーザー変数が割り当てられます",
                    "ko": "변수를 설정할 사용자. 비워 두면 모든 사용자에게 사용자 변수가 할당됩니다",
                })
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("readonly")
                .setDescription("Whether user var can be changed from program (0 = no, 1 = yes)")
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

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
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};