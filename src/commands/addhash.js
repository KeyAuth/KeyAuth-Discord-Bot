const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addhash")
        .setDescription("Add Additional Hash to your Application")
        .setDescriptionLocalizations({
            "en-US": "Add Additional Hash to your Application",
            "fi": "Lisää lisähash sovellukseesi",
            "fr": "Ajouter un hash supplémentaire à votre application",
            "de": "Fügen Sie Ihrer Anwendung einen zusätzlichen Hash hinzu",
            "it": "Aggiungi un hash aggiuntivo alla tua applicazione",
            "nl": "Voeg een extra hash toe aan uw aanvraag",
            "ru": "Добавьте дополнительный хэш к своему приложению",
            "pl": "Dodaj dodatkowy hash do swojej aplikacji",
            "tr": "Uygulamanıza ek hash ekleyin",
            "cs": "Přidejte do své aplikace další hash",
            "ja": "アプリケーションに追加のハッシュを追加します",
            "ko": "응용 프로그램에 추가 해시 추가",
        })
        .addStringOption((option) => 
        option
            .setName("hash")
            .setDescription("MD5 hash you want to add")
            .setDescriptionLocalizations({
                "en-US": "MD5 hash you want to add",
                "fi": "MD5-tiiviste, jonka haluat lisätä",
                "fr": "hachage MD5 que vous souhaitez ajouter",
                "de": "MD5-Hash, den Sie hinzufügen möchten",
                "it": "hash MD5 che si desidera aggiungere",
                "nl": "MD5-hash die u wilt toevoegen",
                "ru": "MD5-хэш, который вы хотите добавить",
                "pl": "MD5-hash, który chcesz dodać",
                "tr": "Eklemek istediğiniz MD5 karma",
                "cs": "MD5 hash, který chcete přidat",
                "ja": "追加したいMD5ハッシュ",
                "ko": "추가하려는 MD5 해시",
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

        let md5hash = interaction.options.getString("hash")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addhash&hash=${md5hash}`)
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