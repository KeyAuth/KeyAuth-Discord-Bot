const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../utils/database')
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
            .setDescription("URL that's hidden on mazkdevf_bot server")
            .setDescriptionLocalizations({
                "en-US": "URL that's hidden on mazkdevf_bot server",
                "fi": "URL, joka on piilotettu mazkdevf_bot-palvelimella",
                "fr": "URL qui est caché sur le serveur mazkdevf_bot",
                "de": "URL, die auf dem mazkdevf_bot-Server versteckt ist",
                "it": "URL che è nascosto sul server mazkdevf_bot",
                "nl": "URL die verborgen is op de mazkdevf_bot-server",
                "ru": "URL, который скрыт на сервере mazkdevf_bot",
                "pl": "URL ukryty na serwerze mazkdevf_bot",
                "tr": "URL, mazkdevf_bot sunucusunda gizli",
                "cs": "URL, který je skrytý na serveru mazkdevf_bot",
                "ja": "mazkdevf_botサーバーで隠されているURL",
                "ko": "mazkdevf_bot 서버에서 숨겨진 URL",
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("useragent")
            .setDescription("User agent, optional. If not set, it will default to mazkdevf_bot")
            .setDescriptionLocalizations({
                "en-US": "User agent, optional. If not set, it will default to mazkdevf_bot",
                "fi": "Käyttäjäagentti, valinnainen. Jos ei ole asetettu, se on oletusarvoisesti mazkdevf_bot",
                "fr": "Agent utilisateur, facultatif. Si non défini, il sera par défaut à mazkdevf_bot",
                "de": "Benutzeragent, optional. Wenn nicht festgelegt, wird es standardmäßig auf mazkdevf_bot gesetzt",
                "it": "User agent, facoltativo. Se non impostato, verrà impostato come mazkdevf_bot",
                "nl": "Gebruikersagent, optioneel. Als het niet is ingesteld, wordt het standaard ingesteld op mazkdevf_bot",
                "ru": "Агент пользователя, необязательный. Если не установлен, по умолчанию будет mazkdevf_bot",
                "pl": "Agent użytkownika, opcjonalny. Jeśli nie jest ustawiony, domyślnie będzie mazkdevf_bot",
                "tr": "Kullanıcı aracısı, isteğe bağlı. Ayarlanmamışsa, mazkdevf_bot olarak varsayılacaktır",
                "cs": "Uživatelský agent, volitelný. Pokud není nastaven, bude nastaven jako výchozí mazkdevf_bot",
                "ja": "ユーザーエージェント、オプション。設定されていない場合は、デフォルトでmazkdevf_botになります",
                "ko": "사용자 에이전트, 선택 사항. 설정되지 않은 경우 기본적으로 mazkdevf_bot가됩니다",
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
		let ephemeral = true;
		
		if(interaction.guild == null) {
			idfrom = interaction.user.id;
			ephemeral = false;
		}
		else {
			idfrom = interaction.guild.id;
		}
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})

        let baseurl = interaction.options.getString("baseurl")
        let useragent = interaction.options.getString("useragent")
        let authed = interaction.options.getString("authed")

        if(isNaN(authed))
        {
            return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('Failure, non-numerical answer provided.').setColor(Colors.Red)], ephemeral: ephemeral})
        }

        if (baseurl.includes("http://") || baseurl.includes("https://"))
        { } else {
            return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Failure, Please Include `http:\/\/` or `https:\/\/` on webhook link").setColor(Colors.Red).setTimestamp().setFooter({ text: "mazkdevf_bot Discord Bot" })], ephemeral: ephemeral })
        }

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addwebhook&baseurl=${baseurl}&us=${useragent}&authed=${authed}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "mazkdevf_bot Discord Bot" })], ephemeral: ephemeral})
            } else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "mazkdevf_bot Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
            }
        })
    },
};