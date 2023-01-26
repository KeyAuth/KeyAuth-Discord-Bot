const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');
const { set_seller } = require('../responses.json')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setseller")
    .setDescription("Sets The seller key")
    .setDescriptionLocalizations({
      "en-US": "Sets The seller key",
      "fi": "Asettaa myyjän avaimen",
      "fr": "Définit la clé du vendeur",
      "de": "Setzt den Verkäufer-Schlüssel",
      "it": "Imposta la chiave del venditore",
      "nl": "Stelt de verkoperssleutel in",
      "ru": "Устанавливает ключ продавца",
      "pl": "Ustawia klucz sprzedawcy",
      "tr": "Satıcı anahtarını ayarlar",
      "cs": "Nastaví klíč prodejce",
      "ja": "販売者キーを設定します",
      "ko": "판매자 키 설정",
    })
    .addStringOption((option) =>
      option
        .setName("sellerkey")
        .setDescription("Specify application seller key")
        .setDescriptionLocalizations({
          "en-US": "Specify application seller key",
          "fi": "Määritä sovelluksen myyjän avain",
          "fr": "Spécifiez la clé du vendeur de l'application",
          "de": "Geben Sie den Verkäufer-Schlüssel der Anwendung an",
          "it": "Specifica la chiave del venditore dell'applicazione",
          "nl": "Geef de verkoperssleutel van de applicatie op",
          "ru": "Укажите ключ продавца приложения",
          "pl": "Określ klucz sprzedawcy aplikacji",
          "tr": "Uygulama satıcı anahtarını belirtin",
          "cs": "Zadejte klíč prodejce aplikace",
          "ja": "アプリケーションの販売者キーを指定してください",
          "ko": "응용 프로그램 판매자 키 지정",
        })
        .setRequired(true)
    ),
  async execute(interaction) {

    let sellerkey = interaction.options.getString("sellerkey")

    fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setseller`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (interaction.guild == null)
            idfrom = interaction.user.id;
          else
            idfrom = interaction.guild.id;
          db.fetch(`token_${idfrom}`)
          db.set(`token_${idfrom}`, sellerkey)
          interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(set_seller.success[interaction.locale] || set_seller.success['default']).setColor(Colors.Green).setTimestamp()], ephemeral: true })
        }
        else {
          interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name:  set_seller.fail[interaction.locale] ? set_seller.fail[interaction.locale].name : set_seller.fail['default'].name , value: set_seller.fail[interaction.locale] ? set_seller.fail[interaction.locale].value : set_seller.fail['default'].value }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true })
        }
      })
  },
};