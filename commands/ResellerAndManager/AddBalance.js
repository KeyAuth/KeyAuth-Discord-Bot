const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-reseller-balance")
        .setDescription("Add balance to reseller accounts.")
        .setDescriptionLocalizations({
            "en-US": "Add balance to reseller accounts.",
            "fi": "Lisää saldoa jälleenmyyjätilille.",
            "fr": "Ajouter un solde aux comptes revendeurs.",
            "de": "Guthaben auf Reseller-Konten hinzufügen.",
            "it": "Aggiungi saldo ai conti rivenditore.",
            "nl": "Voeg saldo toe aan reseller-accounts.",
            "ru": "Добавить баланс на счета реселлеров.",
            "pl": "Dodaj saldo do kont resellerów.",
            "tr": "Bayi hesaplarına bakiye ekleyin.",
            "cs": "Přidejte zůstatek na účty prodejců.",
            "ja": "リセラーアカウントに残高を追加します。",
            "ko": "리셀러 계정에 잔액을 추가하십시오.",
        })
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Username of the account")
                .setDescriptionLocalizations({
                    "en-US": "Username of the account",
                    "fi": "Tilin käyttäjänimi",
                    "fr": "Nom d'utilisateur du compte",
                    "de": "Benutzername des Kontos",
                    "it": "Nome utente dell'account",
                    "nl": "Gebruikersnaam van de account",
                    "ru": "Имя пользователя учетной записи",
                    "pl": "Nazwa użytkownika konta",
                    "tr": "Hesabın kullanıcı adı",
                    "cs": "Uživatelské jméno účtu",
                    "ja": "アカウントのユーザー名",
                    "ko": "계정의 사용자 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("days")
                .setDescription("Number of days")
                .setDescriptionLocalizations({
                    "en-US": "Number of days",
                    "fi": "Päivien lukumäärä",
                    "fr": "Nombre de jours",
                    "de": "Anzahl der Tage",
                    "it": "Numero di giorni",
                    "nl": "Aantal dagen",
                    "ru": "Количество дней",
                    "pl": "Liczba dni",
                    "tr": "Gün sayısı",
                    "cs": "Počet dnů",
                    "ja": "日数",
                    "ko": "일 수",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("weeks")
                .setDescription("Number of weeks")
                .setDescriptionLocalizations({
                    "en-US": "Number of weeks",
                    "fi": "Viikkojen lukumäärä",
                    "fr": "Nombre de semaines",
                    "de": "Anzahl der Wochen",
                    "it": "Numero di settimane",
                    "nl": "Aantal weken",
                    "ru": "Количество недель",
                    "pl": "Liczba tygodni",
                    "tr": "Hafta sayısı",
                    "cs": "Počet týdnů",
                    "ja": "週数",
                    "ko": "주 수",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("months")
                .setDescription("Number of months")
                .setDescriptionLocalizations({
                    "en-US": "Number of months",
                    "fi": "Kuukausien lukumäärä",
                    "fr": "Nombre de mois",
                    "de": "Anzahl der Monate",
                    "it": "Numero di mesi",
                    "nl": "Aantal maanden",
                    "ru": "Количество месяцев",
                    "pl": "Liczba miesięcy",
                    "tr": "Ay sayısı",
                    "cs": "Počet měsíců",
                    "ja": "月数",
                    "ko": "월 수",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("threemonths")
                .setDescription("Number of threemonths")
                .setDescriptionLocalizations({
                    "en-US": "Number of threemonths",
                    "fi": "Kolmen kuukauden lukumäärä",
                    "fr": "Nombre de trois mois",
                    "de": "Anzahl der drei Monate",
                    "it": "Numero di tre mesi",
                    "nl": "Aantal drie maanden",
                    "ru": "Количество трех месяцев",
                    "pl": "Liczba trzech miesięcy",
                    "tr": "Üç ay sayısı",
                    "cs": "Počet tří měsíců",
                    "ja": "3か月の数",
                    "ko": "3 개월 수",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("sixmonths")
                .setDescription("Number of sixmonths")
                .setDescriptionLocalizations({
                    "en-US": "Number of sixmonths",
                    "fi": "Kuuden kuukauden lukumäärä",
                    "fr": "Nombre de six mois",
                    "de": "Anzahl der sechs Monate",
                    "it": "Numero di sei mesi",
                    "nl": "Aantal zes maanden",
                    "ru": "Количество шести месяцев",
                    "pl": "Liczba sześciu miesięcy",
                    "tr": "Altı ay sayısı",
                    "cs": "Počet šesti měsíců",
                    "ja": "6か月の数",
                    "ko": "6 개월 수",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("lifetimes")
                .setDescription("Number of lifetimes")
                .setDescriptionLocalizations({
                    "en-US": "Number of lifetimes",
                    "fi": "Elinaikojen lukumäärä",
                    "fr": "Nombre de vies",
                    "de": "Anzahl der Lebenszeiten",
                    "it": "Numero di vite",
                    "nl": "Aantal levens",
                    "ru": "Количество жизней",
                    "pl": "Liczba żyć",
                    "tr": "Ömür sayısı",
                    "cs": "Počet životů",
                    "ja": "生涯の数",
                    "ko": "생애 수",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let username = interaction.options.getString("username")
        let days = interaction.options.getString("days") || 0;
        let weeks = interaction.options.getString("weeks") || 0;
        let months = interaction.options.getString("months") || 0;
        let threemonths = interaction.options.getString("threemonths") || 0;
        let sixmonths = interaction.options.getString("sixmonths") || 0;
        let lifetimes = interaction.options.getString("lifetimes") || 0;

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addbalance&username=${username}&day=${days}&week=${weeks}&month=${months}&threemonth=${threemonths}&sixmonth=${sixmonths}&lifetime=${lifetimes}`)
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