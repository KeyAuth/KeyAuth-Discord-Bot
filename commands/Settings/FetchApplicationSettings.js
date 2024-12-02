const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetch-application-settings")
        .setDescription("Get Current Settings"),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !!interaction.guild;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        try {
            const response = await fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=getsettings`);
            const json = await response.json();

            if (json.success) {
                const fields = [
                    { name: 'Enabled', value: json.enabled ? "Enabled" : "Disabled" },
                    { name: 'HWID Lock', value: json["hwid-lock"] ? "Enabled" : "Disabled" },
                    { name: 'Version', value: json.version || "not set" },
                    { name: 'Download', value: json.download || "not set" },
                    { name: 'Web Download', value: json.webdownload || "not set" },
                    { name: 'Webhook', value: json.webhook || "not set" },
                    { name: 'Reseller Store', value: json.resellerstore || "not set" },
                    { name: 'Disabled Message', value: json.disabledmsg || "not set" },
                    { name: 'Username Taken Message', value: json.usernametakenmsg || "not set" },
                    { name: 'License Invalid Message', value: json.licenseinvalidmsg || "not set" },
                    { name: 'Key Taken Message', value: json.keytakenmsg || "not set" },
                    { name: 'No Subscription Message', value: json.nosubmsg || "not set" },
                    { name: 'Invalid Username Message', value: json.userinvalidmsg || "not set" },
                    { name: 'Password Invalid Message', value: json.passinvalidmsg || "not set" },
                    { name: 'HWID Mismatch Message', value: json.hwidmismatchmsg || "not set" },
                    { name: 'No Active Subscription Message', value: json.noactivesubmsg || "not set" },
                    { name: 'Blacklisted Message', value: json.blackedmsg || "not set" },
                    { name: 'Paused Message', value: json.pausedmsg || "not set" },
                    { name: 'Sellix Secret', value: json.sellixsecret || "not set" },
                    { name: 'Day Reseller Product ID', value: json.dayresellerproductid || "not set" },
                    { name: 'Week Reseller Product ID', value: json.weekresellerproductid || "not set" },
                    { name: 'Month Reseller Product ID', value: json.monthresellerproductid || "not set" },
                    { name: 'Lifetime Reseller Product ID', value: json.liferesellerproductid || "not set" },
                    { name: 'Cooldown', value: (json.cooldown || "not set") + (json.cooldown ? ' seconds' : '') },
                ];

                const embed = new EmbedBuilder()
                    .setTitle(json.message)
                    .setColor([133, 239, 147])
                    .addFields(fields.filter(field => field.value !== "not set"));

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setTitle(json.message)
                        .addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }])
                        .setColor(Colors.Red)
                        .setFooter({ text: "KeyAuth Discord Bot" })
                        .setTimestamp()
                    ],
                    ephemeral: ephemeral
                });
            }
        } catch (error) {
            console.error('Error fetching application settings:', error);
            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('An error occurred while fetching application settings. Please try again later.')
                    .setColor(Colors.Red)
                    .setTimestamp()
                ],
                ephemeral: ephemeral
            });
        }
    },
};