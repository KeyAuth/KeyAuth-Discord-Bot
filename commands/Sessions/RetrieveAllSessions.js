const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retrieve-all-sessions")
        .setDescription("Retrieve all active sessions"),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;
    
        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()],
            ephemeral: ephemeral
        })
        try {
            const response = await fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallsessions`);
            const json = await response.json();
    
            if (json.success) {
                const sessions = json.sessions;
                if (sessions.length === 0) {
                    return interaction.editReply({
                        embeds: [new EmbedBuilder().setTitle("No Active Sessions").setDescription("There are currently no active sessions.").setColor([133, 239, 147]).setTimestamp()],
                        ephemeral: ephemeral
                    });
                }
    
                const embed = new EmbedBuilder()
                    .setTitle("Active Sessions")
                    .setColor([133, 239, 147])
                    .setTimestamp();
    
                sessions.forEach((session, index) => {
                    embed.addFields(
                        {
                            name: `Session ${index + 1}`,
                            value: `ID: ${session.id}\nValidation ID: ${session.validationid}\nMemo: ${session.memo}\nHWID: ${session.hwid}\nIP: ${session.ip}\nCreation Date: ${session.created_at}`
                        }
                    );
                });
    
                await interaction.editReply({embeds: [embed], ephemeral: ephemeral});
            } else {
                if (json.message === "No sessions found") {
                    await interaction.editReply({
                        embeds: [new EmbedBuilder().setTitle("No Active Sessions").setDescription("There are currently no active sessions. This is normal.").setColor([133, 239, 147]).setTimestamp()],
                        ephemeral: ephemeral
                    });
                } else {
                    await interaction.editReply({
                        embeds: [new EmbedBuilder().setTitle("Error").setDescription(json.message).addFields([{
                            name: 'Note:',
                            value: `Your seller key might be invalid. Change your seller key with \`/add-application\` command.`
                        }]).setColor(Colors.Red).setFooter({text: "KeyAuth Discord Bot"}).setTimestamp()],
                        ephemeral: ephemeral
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("Error").setDescription("An error occurred while fetching sessions. Please try again later.").setColor(Colors.Red).setTimestamp()],
                ephemeral: ephemeral
            });
        }
    },
};