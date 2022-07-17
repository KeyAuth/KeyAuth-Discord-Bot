const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setkeymask")
        .setDescription("Sets License Key mask")
        .addStringOption((option) => 
        option
            .setName("mask")
            .setDescription("Specify mask for License / (null = default)")
            .setRequired(true)
        ),
    async execute(interaction) {

    let license_mask = null; // LEAVE EMPTY
    let licensestring = interaction.options.getString("mask"); // LICENSE STRING == USER INPUT ON MASK

    if (licensestring === "null") // IF USER INPUT == null IT WILL SET UP DEFAULT KEY AS YOU SEE
        license_mask = "XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX";
    else 
        license_mask = licensestring; // ELSE IT WILL PUT USER INPUT AS MASK

	let idfrom = null;
		
	if(interaction.guild == null)
		idfrom = interaction.user.id;
	else
		idfrom = interaction.guild.id;
		
    db.fetch(`licensemask_${idfrom}`)
    db.set(`licensemask_${idfrom}`, license_mask)
    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('License Mask Successfully Set!').setColor(Colors.Green).setTimestamp()], ephemeral: true})

    },
};