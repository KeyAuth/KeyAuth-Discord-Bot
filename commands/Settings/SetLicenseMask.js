const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-license-mask")
        .setDescription("Sets License Key mask")
        .setDescriptionLocalizations({
            "en-US": "Sets License Key mask",
            "fi": "Asettaa lisenssikoodin maskin",
            "fr": "Définit le masque de clé de licence",
            "de": "Setzt das Lizenzschlüssel-Masken",
            "it": "Imposta la maschera della chiave di licenza",
            "nl": "Stelt de licentiesleutelmasker in",
            "ru": "Устанавливает маску лицензионного ключа",
            "pl": "Ustawia maskę klucza licencyjnego",
            "tr": "Lisans Anahtarını maske ayarlar",
            "cs": "Nastaví masku klíče licence",
            "ja": "ライセンスキーのマスクを設定します",
            "ko": "라이센스 키 마스크를 설정합니다",
        })
        .addStringOption((option) =>
            option
                .setName("mask")
                .setDescription("Specify mask for License / (null = default)")
                .setDescriptionLocalizations({
                    "en-US": "Specify mask for License / (null = default)",
                    "fi": "Määritä lisenssi maski / (null = oletus)",
                    "fr": "Spécifiez le masque pour la licence / (null = par défaut)",
                    "de": "Geben Sie das Masken für die Lizenz an / (null = Standard)",
                    "it": "Specifica la maschera per la licenza / (null = predefinito)",
                    "nl": "Geef het masker voor de licentie op / (null = standaard)",
                    "ru": "Укажите маску для лицензии / (null = по умолчанию)",
                    "pl": "Określ maskę dla licencji / (null = domyślny)",
                    "tr": "Lisans için maske belirtin / (null = varsayılan)",
                    "cs": "Zadejte masku pro licenci / (null = výchozí)",
                    "ja": "ライセンスのマスクを指定します / (null = デフォルト)",
                    "ko": "라이센스에 대한 마스크를 지정하십시오 / (null = 기본값)",
                })
                .setRequired(true)
        ),
    async execute(interaction) {

        let license_mask = null; // LEAVE EMPTY
        let licensestring = interaction.options.getString("mask"); // LICENSE STRING == USER INPUT ON MASK

        if (licensestring === "null") // IF USER INPUT == null IT WILL SET UP DEFAULT KEY AS YOU SEE
            license_mask = "XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX";
        else
            license_mask = licensestring; // ELSE IT WILL PUT USER INPUT AS MASK

        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        db.get(`licensemask_${idfrom}`)
        db.set(`licensemask_${idfrom}`, license_mask)
        interaction.editReply({ embeds: [new EmbedBuilder().setTitle('License Mask Successfully Set!').setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

    },
};