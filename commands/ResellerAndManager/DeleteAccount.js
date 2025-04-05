const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-account")
    .setDescription("Delete a reseller or manager account")
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("The username of the reseller or manager to delete")
        .setRequired(true)
    ),
  async execute(interaction) {
    let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
    let ephemeral = !interaction.guild ? false : true;

    let sellerkey = await db.get(`token_${idfrom}`);
    if (sellerkey === null)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\`, then \`/set-application\` Commands First.`,
            )
            .setColor(Colors.Red)
            .setTimestamp(),
        ],
        ephemeral: ephemeral,
      });

    const username = interaction.options.getString("user");

    fetch(
      `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=deleteAccount&user=${username}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Account Deleted Successfully")
                .setDescription(`Account deleted: ${username}`)
                .setColor(Colors.Green)
                .setTimestamp(),
            ],
            ephemeral: ephemeral,
          });
        } else {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(json.message || "Unknown error occurred")
                .addFields([
                  {
                    name: "Note:",
                    value: `Your seller key may be invalid or the account doesn't exist.`,
                  },
                ])
                .setColor(Colors.Red)
                .setTimestamp()
                .setFooter({ text: "KeyAuth Discord Bot" }),
            ],
            ephemeral: ephemeral,
          });
        }
      })
      .catch((error) => {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(`Failed to connect to the KeyAuth API.`)
              .addFields([
                {
                  name: "Error Details:",
                  value: `\`\`\`${error}\`\`\``,
                },
              ])
              .setColor(Colors.Red)
              .setTimestamp()
              .setFooter({ text: "KeyAuth Discord Bot" }),
          ],
          ephemeral: ephemeral,
        });
      });
  },
}; 