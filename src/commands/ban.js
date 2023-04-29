const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
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

        let key = interaction.options.getString("key")
        let reason = interaction.options.getString("reason")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=ban&key=${key}&reason=${reason}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral})
            } else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral})
            }
        })
    },
};