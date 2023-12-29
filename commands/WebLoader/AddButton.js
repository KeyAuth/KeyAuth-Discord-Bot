const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addbutton")
        .setDescription("Create New Web Loader Button")
        .addStringOption((option) =>
            option
                .setName("value")
                .setDescription("Value of the web loader button")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("text")
                .setDescription("The text for the web loader button.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = null;
        let ephemeral = true;

        if (interaction.guild == null) {
            idfrom = interaction.user.id;
            ephemeral = false;
        }
        else {
            idfrom = interaction.guild.id;
        }

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let value = interaction.options.getString("value")
        let text = interaction.options.getString("text")

        //  https://keyauth.win/api/seller/?sellerkey={sellerkey}&type=addbutton&value={value}&text={text}
        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addbutton&value=${value}&text=${text}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Blue).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "mazkdevf_bot Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }

            })
    },
};