const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-multiple-licenses")
        .setDescription("Delete multiple licenses")
        .addStringOption((option) =>
            option
                .setName("licenses")
                .setDescription("Specify key you would like deleted (seperate with comma and space)")
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

        let keys = interaction.options.getString("licenses")
        let userToo = interaction.options.getBoolean("usertoo") ? 1 : 0;

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delmultiple&key=${keys}&userToo=${userToo}&format=json`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Keys Deleted:', value: `\`${keys}\`` }]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.` }]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};