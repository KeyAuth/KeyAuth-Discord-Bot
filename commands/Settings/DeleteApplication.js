const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("del-application")
    .setDescription("Delete an application or seller key from the bot.")
    .addStringOption((option) =>
      option
        .setName("application")
        .setDescription("Specify the application name to delete.")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Determine the ID context for database queries
    const idFromGuild = interaction.guild ? interaction.guild.id : interaction.user.id;
    
    // Set ephemeral flag based on the context
    const ephemeral = !!interaction.guild;

    // Extract the specified application name from interaction options
    const application = interaction.options.getString("application");

    // Retrieve existing applications from the database
    let applications = await db.get(`applications_${idFromGuild}`);
    
    // Initialize an empty array if no applications exist yet
    if (applications === null) {
      applications = [];
    }

    // Inform if no applications exist
    if (applications.length === 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("No applications have been added yet.")
            .setColor(Colors.Red)
            .setTimestamp()
        ],
        ephemeral: ephemeral
      });
    }

    // Inform if application name is not specified
    if (!application) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Please specify the application name to delete.")
            .setColor(Colors.Red)
            .setTimestamp()
        ],
        ephemeral: ephemeral
      });
    }

    // Filter out the specified application from the applications array
    const deletedApplications = applications.filter(app => app.application === application);

    // Inform if specified application does not exist
    if (deletedApplications.length === 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`The application \`${application}\` does not exist.`)
            .setColor(Colors.Red)
            .setTimestamp()
        ],
        ephemeral: ephemeral
      });
    }

    // Remove all occurrences of specified application from the applications array
    applications = applications.filter(app => app.application !== application);

    // Update the applications in the database
    await db.set(`applications_${idFromGuild}`, applications);

    // Inform about successful deletion
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Application(s) with name ${application} have been deleted!`)
          .setColor(Colors.Green)
          .setTimestamp()
      ],
      ephemeral: ephemeral
    });
  },
};
