const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-license")
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
        )
        .addBooleanOption((option) =>
            option
                .setName("usertoo")
                .setDescription("Delete from user too?")
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let key = interaction.options.getString("license")
        let userToo = interaction.options.getBoolean("usertoo") ? 1 : 0;

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=del&key=${key}&userToo=${userToo}&format=json`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Key Deleted:', value: `\`${key}\`` }]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.` }]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};