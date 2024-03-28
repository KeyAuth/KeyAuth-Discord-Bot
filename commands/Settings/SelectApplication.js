const { SlashCommandBuilder, Colors, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const db = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("select-application")
        .setDescription("Select an application / seller key to use."),

    async execute(interaction) {
        const idFromGuild = interaction.guild ? interaction.guild.id : interaction.user.id;
        const ephemeral = !!interaction.guild;
        let applications = await db.get(`applications_${idFromGuild}`) || [];

        if (applications.length === 0) {
            const noApplicationsEmbed = new EmbedBuilder()
                .setTitle(`Hey ${interaction.user.username} 👋`)
                .setDescription(`Please use the \`/add-application\` command to add applications.`)
                .setColor(Colors.Blue)
                .setThumbnail("https://cdn.keyauth.cc/front/assets/img/favicon.png")
                .setFooter({ text: "KeyAuth Discord Bot" })
                .setTimestamp();

            return interaction.editReply({ embeds: [noApplicationsEmbed], ephemeral });
        }

        const buttons = applications.map((app, index) =>
            new ButtonBuilder()
                .setCustomId(`selectapp_${app.id}`)
                .setLabel(app.application)
                .setStyle(ButtonStyle.Primary)
        );

        const rows = [];
        for (let i = 0; i < buttons.length; i += 5) {
            rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
        }

        const Embed = new EmbedBuilder()
            .setTitle(`Hey ${interaction.user.username} 👋`)
            .setDescription(`
        Please select below the application you want to use with the bot.

        🔔**Note:** If you want to add new applications, you can do it with the \`/add-application\` command.\n\n
        ⚠️**Friendly Reminder:** You can only select one application at a time. Also, if you add a new application without specifying its name, rest assured, the first 6 letters of the seller key will be automatically utilized, with the remaining characters obscured for security.
      `)
            .setColor(Colors.Blue)
            .setThumbnail("https://cdn.keyauth.cc/front/assets/img/favicon.png")
            .setFooter({ text: "KeyAuth Discord Bot" })
            .setTimestamp();

        interaction.editReply({ content: `Select an application to use:`, components: rows, embeds: [Embed], ephemeral });
    },
};
