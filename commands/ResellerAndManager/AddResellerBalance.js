const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-reseller-balance")
    .setDescription("Add balance to a reseller account")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The username of the reseller")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("day")
        .setDescription("Amount of days to add")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("week")
        .setDescription("Amount of weeks to add")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("month")
        .setDescription("Amount of months to add")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("threemonth")
        .setDescription("Amount of three months to add")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("sixmonth")
        .setDescription("Amount of six months to add")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("lifetime")
        .setDescription("Amount of lifetime to add (recommended to use 1)")
        .setRequired(false)
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
    const day = interaction.options.getInteger("day");
    const week = interaction.options.getInteger("week");
    const month = interaction.options.getInteger("month");
    const threemonth = interaction.options.getInteger("threemonth");
    const sixmonth = interaction.options.getInteger("sixmonth");
    const lifetime = interaction.options.getInteger("lifetime");

    // Ensure at least one balance option is provided
    if (!day && !week && !month && !threemonth && !sixmonth && !lifetime) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You must specify at least one balance option to add.")
            .setColor(Colors.Red)
            .setTimestamp(),
        ],
        ephemeral: ephemeral,
      });
    }

    // Build URL with all provided parameters
    let url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setbalance&username=${username}`;
    
    if (day) url += `&day=${day}`;
    if (week) url += `&week=${week}`;
    if (month) url += `&month=${month}`;
    if (threemonth) url += `&threemonth=${threemonth}`;
    if (sixmonth) url += `&sixmonth=${sixmonth}`;
    if (lifetime) url += `&lifetime=${lifetime}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Balance Added Successfully")
                .setDescription(`Balance has been added to reseller: ${username}`)
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