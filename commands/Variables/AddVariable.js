const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-variable")
        .setDescription("Add application variable")
        .setDescriptionLocalizations({
            "en-US": "Add application variable",
            "fi": "Lisää sovellusmuuttuja",
            "fr": "Ajouter une variable d'application",
            "de": "Anwendungsvariable hinzufügen",
            "it": "Aggiungi variabile di applicazione",
            "nl": "Voeg applicatievariabele toe",
            "ru": "Добавить переменную приложения",
            "pl": "Dodaj zmienną aplikacji",
            "tr": "Uygulama değişkeni ekle",
            "cs": "Přidat aplikaci proměnnou",
            "ja": "アプリケーション変数を追加する",
            "ko": "응용 프로그램 변수 추가",
        })
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Variable Name?")
                .setDescriptionLocalizations({
                    "en-US": "Variable Name?",
                    "fi": "Muuttujan nimi?",
                    "fr": "Nom de la variable?",
                    "de": "Variablenname?",
                    "it": "Nome della variabile?",
                    "nl": "Variabelenaam?",
                    "ru": "Имя переменной?",
                    "pl": "Nazwa zmiennej?",
                    "tr": "Değişken adı?",
                    "cs": "Název proměnné?",
                    "ja": "変数名？",
                    "ko": "변수 이름?",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("value")
                .setDescription("Variable Value?")
                .setDescriptionLocalizations({
                    "en-US": "Variable Value?",
                    "fi": "Muuttujan arvo?",
                    "fr": "Valeur de la variable?",
                    "de": "Variablenwert?",
                    "it": "Valore della variabile?",
                    "nl": "Variabele waarde?",
                    "ru": "Значение переменной?",
                    "pl": "Wartość zmiennej?",
                    "tr": "Değişken değeri?",
                    "cs": "Hodnota proměnné?",
                    "ja": "変数値？",
                    "ko": "변수 값?",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("authed")
                .setDescription("Determines whether user needs to be logged in (1) or not (0)")
                .setDescriptionLocalizations({
                    "en-US": "Determines whether user needs to be logged in (1) or not (0)",
                    "fi": "Määrittää, onko käyttäjän kirjautua sisään (1) tai ei (0)",
                    "fr": "Détermine si l'utilisateur doit être connecté (1) ou non (0)",
                    "de": "Bestimmt, ob der Benutzer angemeldet sein muss (1) oder nicht (0)",
                    "it": "Determina se l'utente deve essere connesso (1) o no (0)",
                    "nl": "Bepaalt of de gebruiker moet zijn ingelogd (1) of niet (0)",
                    "ru": "Определяет, должен ли пользователь войти в систему (1) или нет (0)",
                    "pl": "Określa, czy użytkownik musi się zalogować (1) lub nie (0)",
                    "tr": "Kullanıcının giriş yapması gerekip gerekmediğini (1) veya gerekmediğini (0) belirler",
                    "cs": "Určuje, zda se uživatel musí přihlásit (1) nebo ne (0)",
                    "ja": "ユーザーがログインする必要があるかどうか（1）またはそうでないか（0）を決定します",
                    "ko": "사용자가 로그인해야하는지 (1) 아니면 아닌지 (0) 결정합니다",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let varname = interaction.options.getString("name")
        let varvalue = interaction.options.getString("value")
        let authed = interaction.options.getString("authed")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addvar&name=${varname}&data=${varvalue}&authed=${authed}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Variable Successfully Added!').setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};