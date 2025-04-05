const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-account")
    .setDescription("Create a new reseller or manager account")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("The role of the account")
        .setRequired(true)
        .addChoices(
          { name: 'Reseller', value: 'Reseller' },
          { name: 'Manager', value: 'Manager' }
        )
    )
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("The username for the account")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("pass")
        .setDescription("The password for the account")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("keylevels")
        .setDescription("What key levels they can create (comma-separated)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("The email for the account")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("perms")
        .setDescription("Permissions for manager (see https://keyauth.cc/app/?page=manage-accs)")
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

    const role = interaction.options.getString("role");
    const username = interaction.options.getString("user");
    const password = interaction.options.getString("pass");
    const keylevels = interaction.options.getString("keylevels");
    const email = interaction.options.getString("email");
    const perms = interaction.options.getString("perms");

    // Build URL with all provided parameters
    let url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addAccount&role=${role}&user=${username}&pass=${password}&keylevels=${keylevels}&email=${email}`;
    
    if (perms && role === "Manager") {
      url += `&perms=${perms}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Account Created Successfully")
                .setDescription(`${role} account created for: ${username}`)
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
                    value: `Your seller key may be invalid or there was an issue with the provided information.`,
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