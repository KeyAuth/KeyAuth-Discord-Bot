const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-application")
    .setDescription("Add an application / seller key to the database.")
    .addStringOption((option) =>
      option
        .setName("sellerkey")
        .setDescription("Specify application seller key")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("application")
        .setDescription("Specify application name")
    ),
  async execute(interaction) {
    let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
    let ephemeral = !interaction.guild ? false : true;
    let sellerkey = interaction.options.getString("sellerkey")

    const application = interaction.options.getString("application");
    let temporary = !application ? sellerkey.substring(0, 6) : application

    console.log(temporary)
    if (application != null) {
      if (!/^[a-zA-Z0-9]+$/.test(application)) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The application name can only contain letters and numbers.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
      }
    }

    let applications = await db.get(`applications_${idfrom}`);
    if (applications === null) applications = [];
    if (applications.some(app => app.application === temporary)) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`The application \`${temporary}\` already exists.`)
            .setColor(Colors.Red)
            .setTimestamp()
        ],
        ephemeral: ephemeral
      });
    }

    fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setseller`)
      .then(res => res.json())
      .then(async json => {
        if (json.success) {
          await applications.push({
            application: !application ? sellerkey.substring(0, 6) : application,
            sellerkey: sellerkey,
            id: IdGenerator()
          });
          await db.set(`applications_${idfrom}`, applications);
          interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Application with name ${!application ? sellerkey.substring(0, 6) : application} has been added!`).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
        }
        else {
          interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
        }
      })

  },
};

function IdGenerator() {
  var uuid = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 32; i++) {
    uuid += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return uuid;
}