const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createwebhook")
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
            .setDescription("URL that's hidden on KeyAuth server")
            .setDescriptionLocalizations({
                "en-US": "URL that's hidden on KeyAuth server",
                "fi": "URL, joka on piilotettu KeyAuth-palvelimella",
                "fr": "URL qui est caché sur le serveur KeyAuth",
                "de": "URL, die auf dem KeyAuth-Server versteckt ist",
                "it": "URL che è nascosto sul server KeyAuth",
                "nl": "URL die verborgen is op de KeyAuth-server",
                "ru": "URL, который скрыт на сервере KeyAuth",
                "pl": "URL ukryty na serwerze KeyAuth",
                "tr": "URL, KeyAuth sunucusunda gizli",
                "cs": "URL, který je skrytý na serveru KeyAuth",
                "ja": "KeyAuthサーバーで隠されているURL",
                "ko": "KeyAuth 서버에서 숨겨진 URL",
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("useragent")
            .setDescription("User agent, optional. If not set, it will default to KeyAuth")
            .setDescriptionLocalizations({
                "en-US": "User agent, optional. If not set, it will default to KeyAuth",
                "fi": "Käyttäjäagentti, valinnainen. Jos ei ole asetettu, se on oletusarvoisesti KeyAuth",
                "fr": "Agent utilisateur, facultatif. Si non défini, il sera par défaut à KeyAuth",
                "de": "Benutzeragent, optional. Wenn nicht festgelegt, wird es standardmäßig auf KeyAuth gesetzt",
                "it": "User agent, facoltativo. Se non impostato, verrà impostato come KeyAuth",
                "nl": "Gebruikersagent, optioneel. Als het niet is ingesteld, wordt het standaard ingesteld op KeyAuth",
                "ru": "Агент пользователя, необязательный. Если не установлен, по умолчанию будет KeyAuth",
                "pl": "Agent użytkownika, opcjonalny. Jeśli nie jest ustawiony, domyślnie będzie KeyAuth",
                "tr": "Kullanıcı aracısı, isteğe bağlı. Ayarlanmamışsa, KeyAuth olarak varsayılacaktır",
                "cs": "Uživatelský agent, volitelný. Pokud není nastaven, bude nastaven jako výchozí KeyAuth",
                "ja": "ユーザーエージェント、オプション。設定されていない場合は、デフォルトでKeyAuthになります",
                "ko": "사용자 에이전트, 선택 사항. 설정되지 않은 경우 기본적으로 KeyAuth가됩니다",
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
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let baseurl = interaction.options.getString("baseurl")
        let useragent = interaction.options.getString("useragent")
        let authed = interaction.options.getString("authed")

        if(isNaN(authed))
        {
            return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('Failure, non-numerical answer provided.').setColor(Colors.Red)], ephemeral: true})
        }

        if (baseurl.includes("http://") || baseurl.includes("https://"))
        { } else {
            return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Failure, Please Include `http:\/\/` or `https:\/\/` on webhook link").setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true })
        }

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addwebhook&baseurl=${baseurl}&ua=${useragent}&authed=${authed}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            } else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};