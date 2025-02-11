const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-whitelist")
        .setDescription("Add a new IP to the whitelist")
        .addStringOption((option) =>
            option
                .setName("ip")
                .setDescription("The IP you would like to add to the whitelist.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for adding this IP to the whitelist (Optional).")
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let ip = interaction.options.getString("ip")
        let reason = interaction.options.getString("reason")

        let apiUrl = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addWhite&ip=${ip}`;
        if (reason) {
            apiUrl += `&reason=${encodeURIComponent(reason)}`;
        }

        fetch(apiUrl)
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