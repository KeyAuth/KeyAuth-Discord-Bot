const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban-license")
        .setDescription("Ban license key")
        .setDescriptionLocalizations({
            "en-US": "Ban license key",
            "fi": "Estä lisenssikoodi",
            "fr": "Interdire la clé de licence",
            "de": "Lizenzschlüssel sperren",
            "it": "Blocca la chiave di licenza",
            "nl": "Licentiesleutel verbannen",
            "ru": "Запретить лицензионный ключ",
            "pl": "Zbanuj klucz licencyjny",
            "tr": "Lisans anahtarını yasakla",
            "cs": "Zakáže licenční klíč",
            "ja": "ライセンスキーを禁止する",
            "ko": "라이센스 키 금지",
        })
        .addStringOption((option) =>
            option
                .setName("key")
                .setDescription("Key you wish to ban")
                .setDescriptionLocalizations({
                    "en-US": "Key you wish to ban",
                    "fi": "Avain, jonka haluat estää",
                    "fr": "Clé que vous souhaitez interdire",
                    "de": "Schlüssel, den Sie sperren möchten",
                    "it": "Chiave che desideri bloccare",
                    "nl": "Sleutel die u wilt verbannen",
                    "ru": "Ключ, который вы хотите запретить",
                    "pl": "Klucz, który chcesz zbanować",
                    "tr": "Yasaklamak istediğiniz anahtar",
                    "cs": "Klíč, který chcete zakázat",
                    "ja": "禁止したいキー",
                    "ko": "금지하려는 키",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for the ban")
                .setDescriptionLocalizations({
                    "en-US": "Reason for the ban",
                    "fi": "Syy bannille",
                    "fr": "Raison du bannissement",
                    "de": "Grund für die Sperrung",
                    "it": "Motivo del ban",
                    "nl": "Reden voor de ban",
                    "ru": "Причина бана",
                    "pl": "Powód bana",
                    "tr": "Yasaklama nedeni",
                    "cs": "Důvod pro zákaz",
                    "ja": "禁止の理由",
                    "ko": "금지의 이유",
                })
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("usertoo")
                .setDescription("Ban user too?")
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let key = interaction.options.getString("key")
        let reason = interaction.options.getString("reason")
        let userToo = interaction.options.getBoolean("usertoo") ? 1 : 0;

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=ban&key=${key}&reason=${reason}&userToo=${userToo}`)
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