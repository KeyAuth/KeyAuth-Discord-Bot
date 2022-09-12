const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("del")
        .setDescription("Delete a key")
        .setDescriptionLocalizations({
            "en-US": "Delete a key",
            "fi": "Poista avain",
            "fr": "Supprimer une clé",
            "de": "Schlüssel löschen",
            "it": "Elimina una chiave",
            "nl": "Sleutel verwijderen",
            "ru": "Удалить ключ",
            "pl": "Usuń klucz",
            "tr": "Bir anahtarı sil",
            "cs": "Odstranit klíč",
            "ja": "キーを削除する",
            "ko": "키 삭제",
        })
        .addStringOption((option) => 
        option
            .setName("license")
            .setDescription("Specify key you would like deleted")
            .setDescriptionLocalizations({
                "en-US": "Specify key you would like deleted",
                "fi": "Määritä poistettava avain",
                "fr": "Spécifiez la clé que vous souhaitez supprimer",
                "de": "Geben Sie den Schlüssel an, den Sie löschen möchten",
                "it": "Specifica la chiave che desideri eliminare",
                "nl": "Geef de sleutel op die u wilt verwijderen",
                "ru": "Укажите ключ, который вы хотите удалить",
                "pl": "Określ klucz, który chcesz usunąć",
                "tr": "Silmek istediğiniz anahtarı belirtin",
                "cs": "Zadejte klíč, který chcete odstranit",
                "ja": "削除したいキーを指定してください",
                "ko": "삭제할 키를 지정하십시오",
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

        let key = interaction.options.getString("license")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=del&key=${key}&format=json`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{name: 'Key Deleted:', value: `\`${key}\``}]).setColor(Colors.Green).setTimestamp()], ephemeral: true})
        }
        else
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`}]).setColor(Colors.Red).setTimestamp()], ephemeral: true})
        }
        })
    },
};