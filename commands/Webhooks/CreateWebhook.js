const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-webhook")
        .setDescription("Add webhook to application")
        .setDescriptionLocalizations({
            "en-US": "Add webhook to application",
            "fi": "Lisää web-hook sovellukseen",
            "fr": "Ajouter un webhook à l'application",
            "de": "Webhook zur Anwendung hinzufügen",
            "it": "Aggiungi webhook all'applicazione",
            "nl": "Webhook toevoegen aan applicatie",
            "ru": "Добавить веб-хук в приложение",
            "pl": "Dodaj webhook do aplikacji",
            "tr": "Uygulamaya webhook ekleyin",
            "cs": "Přidat webhook do aplikace",
            "ja": "アプリケーションにWebhookを追加する",
            "ko": "응용 프로그램에 웹 훅 추가",
        })
        .addStringOption((option) =>
            option
                .setName("baseurl")
                .setDescription("URL that's hidden on keyauth server")
                .setDescriptionLocalizations({
                    "en-US": "URL that's hidden on keyauth server",
                    "fi": "URL, joka on piilotettu keyauth -palvelimella",
                    "fr": "URL qui est caché sur le serveur keyauth ",
                    "de": "URL, die auf dem keyauth -Server versteckt ist",
                    "it": "URL che è nascosto sul server keyauth ",
                    "nl": "URL die verborgen is op de keyauth -server",
                    "ru": "URL, который скрыт на сервере keyauth ",
                    "pl": "URL ukryty na serwerze keyauth ",
                    "tr": "URL, keyauth sunucusunda gizli",
                    "cs": "URL, který je skrytý na serveru keyauth ",
                    "ja": "keyauth サーバーで隠されているURL",
                    "ko": "keyauth 서버에서 숨겨진 URL",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("useragent")
                .setDescription("User agent, optional. If not set, it will default to keyauth ")
                .setDescriptionLocalizations({
                    "en-US": "User agent, optional. If not set, it will default to keyauth ",
                    "fi": "Käyttäjäagentti, valinnainen. Jos ei ole asetettu, se on oletusarvoisesti keyauth ",
                    "fr": "Agent utilisateur, facultatif. Si non défini, il sera par défaut à keyauth ",
                    "de": "Benutzeragent, optional. Wenn nicht festgelegt, wird es standardmäßig auf keyauth gesetzt",
                    "it": "User agent, facoltativo. Se non impostato, verrà impostato come keyauth ",
                    "nl": "Gebruikersagent, optioneel. Als het niet is ingesteld, wordt het standaard ingesteld op keyauth ",
                    "ru": "Агент пользователя, необязательный. Если не установлен, по умолчанию будет keyauth ",
                    "pl": "Agent użytkownika, opcjonalny. Jeśli nie jest ustawiony, domyślnie będzie keyauth ",
                    "tr": "Kullanıcı aracısı, isteğe bağlı. Ayarlanmamışsa, keyauth olarak varsayılacaktır",
                    "cs": "Uživatelský agent, volitelný. Pokud není nastaven, bude nastaven jako výchozí keyauth ",
                    "ja": "ユーザーエージェント、オプション。設定されていない場合は、デフォルトでkeyauth になります",
                    "ko": "사용자 에이전트, 선택 사항. 설정되지 않은 경우 기본적으로 keyauth 가됩니다",
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
                    "ru": "Определяет, нужно ли пользователю войти в систему (1) или нет (0)",
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

        let baseurl = interaction.options.getString("baseurl")
        let useragent = interaction.options.getString("useragent")
        let authed = interaction.options.getString("authed")

        if (isNaN(authed)) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Failure, non-numerical answer provided.').setColor(Colors.Red)], ephemeral: ephemeral })
        }

        if (baseurl.includes("http://") || baseurl.includes("https://")) { } else {
            return interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Failure, Please Include `http:\/\/` or `https:\/\/` on webhook link").setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
        }

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addwebhook&baseurl=${baseurl}&us=${useragent}&authed=${authed}`)
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