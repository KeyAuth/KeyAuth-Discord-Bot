const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-blacklist")
        .setDescription("Delete blacklist")
        .setDescriptionLocalizations({
            "en-US": "Delete blacklist",
            "fi": "Poista musta lista",
            "fr": "Supprimer la liste noire",
            "de": "Schwarze Liste löschen",
            "it": "Elimina blacklist",
            "nl": "Verwijder zwarte lijst",
            "ru": "Удалить черный список",
            "pl": "Usuń czarną listę",
            "tr": "Kara listeyi sil",
            "cs": "Odstranit černou listinu",
            "ja": "ブラックリストを削除する",
            "ko": "블랙리스트 삭제",
        })
        .addStringOption((option) =>
            option
                .setName("data")
                .setDescription("Blacklist data here.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("blacktype")
                .setDescription("IP or HWID.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let data = interaction.options.getString("data")
        let blacktype = interaction.options.getString("blacktype")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delblack&data=${data}&blacktype=${blacktype}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                }
            })
    },
};