const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-license-note")
        .setDescription("Set a note for a key")
        .addStringOption((option) =>
            option
                .setName("note")
                .setDescription("Note to set")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("license")
                .setDescription("License to set note of")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let note = interaction.options.getString("note")
        let license = interaction.options.getString("license")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setnote&key=${license}&note=${note}&format=json`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "grohom Discord Bot" })], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "grohom Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};