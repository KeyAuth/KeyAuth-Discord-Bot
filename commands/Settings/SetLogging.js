const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-logging")
        .setDescription("Sets a Discord webhook to log commands used on this bot.")
        .setDescriptionLocalizations({
            "en-US": "Sets a Discord webhook to log commands used on this bot.",
            "fi": "Asettaa Discord-webhookin lokitukseen käytetyt komennot tässä botti.",
            "fr": "Définit un webhook Discord pour enregistrer les commandes utilisées sur ce bot.",
            "de": "Stellt einen Discord-Webhook ein, um Befehle zu protokollieren, die auf diesem Bot verwendet werden.",
            "it": "Imposta un webhook Discord per registrare i comandi utilizzati su questo bot.",
            "nl": "Stelt een Discord-webhook in om opdrachten te loggen die op deze bot worden gebruikt.",
            "ru": "Устанавливает Discord-веб-хук для регистрации команд, используемых в этом боте.",
            "pl": "Ustawia webhook Discord do rejestrowania poleceń używanych w tym bocie.",
            "tr": "Bu bot üzerinde kullanılan komutları günlüğe kaydetmek için bir Discord webhook ayarlar.",
            "cs": "Nastaví Discord webhook pro zaznamenávání příkazů použitých v tomto botovi.",
            "ja": "このボットで使用されたコマンドを記録するためのDiscord Webhookを設定します。",
            "ko": "이 봇에서 사용된 명령을 로그로 기록하기 위해 Discord 웹 훅을 설정합니다.",
        })
        .addStringOption((option) =>
            option
                .setName("webhook")
                .setDescription("Discord webhook URL")
                .setDescriptionLocalizations({
                    "en-US": "Discord webhook URL",
                    "fi": "Discord webhook URL",
                    "fr": "URL de webhook Discord",
                    "de": "Discord-Webhook-URL",
                    "it": "URL webhook Discord",
                    "nl": "Discord-webhook-URL",
                    "ru": "URL Discord-веб-хука",
                    "pl": "URL webhook Discord",
                    "tr": "Discord webhook URL",
                    "cs": "URL webhook Discord",
                    "ja": "Discord Webhook URL",
                    "ko": "Discord 웹 훅 URL",
                })
                .setRequired(true)
        ),
    async execute(interaction) {

        let webhook = interaction.options.getString("webhook")

        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        db.get(`wh_url_${idfrom}`)
        db.set(`wh_url_${idfrom}`, webhook)
        interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Successfully set discord webhook to log commands to').setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })

    },
};