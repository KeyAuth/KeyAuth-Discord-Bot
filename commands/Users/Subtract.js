const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("subtract")
        .setDescription("Subtract from user subscription,")
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("The username of the user you're subtracting time form.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("sub")
                .setDescription("Their subscription name.")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("seconds")
                .setDescription("Time to subtract from their subscription.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")
        let sub = interaction.options.getString("sub")
        let seconds = interaction.options.getInteger("seconds")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=subtract&user=${user}&sub=${sub}&seconds=${seconds}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Blue).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }

            })
    },
};