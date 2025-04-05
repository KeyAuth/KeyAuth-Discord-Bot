const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-reseller-balance")
    .setDescription("Retrieve the balance from a reseller")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The username of the reseller")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("appname")
        .setDescription("The application name the reseller is assigned to")
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

    const username = interaction.options.getString("username");
    const appname = interaction.options.getString("appname");

    fetch(
      `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=getbalance&username=${username}&appname=${appname}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // Prepare balance fields
          const fields = [];
          
          if (json.balance) {
            // Add each balance type, defaulting to 0 if undefined or null
            fields.push({ name: "Day", value: (json.balance.day !== undefined && json.balance.day !== null) ? json.balance.day.toString() : "0", inline: true });
            fields.push({ name: "Week", value: (json.balance.week !== undefined && json.balance.week !== null) ? json.balance.week.toString() : "0", inline: true });
            fields.push({ name: "Month", value: (json.balance.month !== undefined && json.balance.month !== null) ? json.balance.month.toString() : "0", inline: true });
            fields.push({ name: "Three Month", value: (json.balance.three_month !== undefined && json.balance.three_month !== null) ? json.balance.three_month.toString() : "0", inline: true });
            fields.push({ name: "Six Month", value: (json.balance.six_month !== undefined && json.balance.six_month !== null) ? json.balance.six_month.toString() : "0", inline: true });
            fields.push({ name: "Lifetime", value: (json.balance.lifetime !== undefined && json.balance.lifetime !== null) ? json.balance.lifetime.toString() : "0", inline: true });
            fields.push({ name: "Year", value: (json.balance.year !== undefined && json.balance.year !== null) ? json.balance.year.toString() : "0", inline: true });
          }
          
          // If no balance found, add a default field
          if (fields.length === 0) {
            fields.push({ name: "Balance", value: "No balance information available", inline: false });
          }
          
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`Reseller Balance: ${username}`)
                .setDescription(`Application: ${appname}`)
                .addFields(fields)
                .setColor(Colors.Blue)
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
                    value: `Your seller key may be invalid or the reseller account doesn't exist.`,
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