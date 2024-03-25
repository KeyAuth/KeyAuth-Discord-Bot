const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban-license")
        .setDescription("Unban license key")
        .setDescriptionLocalizations({
            "en-US": "Unban license key",
            "fi": "Poista lisenssikoodin esto",
            "fr": "Débannir la clé de licence",
            "de": "Lizenzschlüssel freigeben",
            "it": "Sbanna la chiave di licenza",
            "nl": "Deban licentiesleutel",
            "ru": "Разбанить лицензионный ключ",
            "pl": "Odbanuj klucz licencyjny",
            "tr": "Lisans anahtarını debanlayın",
            "cs": "Odbanovat licenční klíč",
            "ja": "ライセンスキーの禁止を解除する",
            "ko": "라이센스 키 차단 해제",
        })
        .addStringOption((option) =>
            option
                .setName("key")
                .setDescription("Key you wish to unban")
                .setDescriptionLocalizations({
                    "en-US": "Key you wish to unban",
                    "fi": "Avain, jonka haluat poistaa estosta",
                    "fr": "Clé que vous souhaitez débannir",
                    "de": "Schlüssel, den Sie freigeben möchten",
                    "it": "Chiave che desideri sbannare",
                    "nl": "Sleutel die u wilt debannen",
                    "ru": "Ключ, который вы хотите разбанить",
                    "pl": "Klucz, który chcesz odbanować",
                    "tr": "Debanlamak istediğiniz anahtar",
                    "cs": "Klíč, který chcete odbanovat",
                    "ja": "禁止を解除したいキー",
                    "ko": "차단 해제하려는 키",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let key = interaction.options.getString("key")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=unban&key=${key}`)
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