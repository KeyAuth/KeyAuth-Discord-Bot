const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetch-application-settings")
        .setDescription("Get Current Settings"),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=getsettings`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    const enabled = json.enabled ? "Enabled" : "Disabled";
                    const hwidlock = json["hwid-lock"] ? "Enabled" : "Disabled";
                    const version = json.version !== undefined ? json.version : "not set";
                    const download = json.download !== undefined ? json.download : "not set";
                    const webdownload = json.webdownload !== undefined ? json.webdownload : "not set";
                    const webhook = json.webhook !== undefined ? json.webhook : "not set";
                    const resellerstore = json.resellerstore !== undefined ? json.resellerstore : "not set";
                    const disabledmsg = json.disabledmsg !== undefined ? json.disabledmsg : "not set";
                    const usernametakenmsg = json.usernametakenmsg !== undefined ? json.usernametakenmsg : "not set";
                    const licenseinvalidmsg = json.licenseinvalidmsg !== undefined ? json.licenseinvalidmsg : "not set";
                    const keytakenmsg = json.keytakenmsg !== undefined ? json.keytakenmsg : "not set";
                    const nosubmsg = json.nosubmsg !== undefined ? json.nosubmsg : "not set";
                    const userinvalidmsg = json.userinvalidmsg !== undefined ? json.userinvalidmsg : "not set";
                    const passinvalidmsg = json.passinvalidmsg !== undefined ? json.passinvalidmsg : "not set";
                    const hwidmismatchmsg = json.hwidmismatchmsg !== undefined ? json.hwidmismatchmsg : "not set";
                    const noactivesubmsg = json.noactivesubmsg !== undefined ? json.noactivesubmsg : "not set";
                    const blackedmsg = json.blackedmsg !== undefined ? json.blackedmsg : "not set";
                    const pausedmsg = json.pausedmsg !== undefined ? json.pausedmsg : "not set";
                    const sellixsecret = json.sellixsecret !== undefined ? json.sellixsecret : "not set";
                    const dayresellerproductid = json.dayresellerproductid !== undefined ? json.dayresellerproductid : "not set";
                    const weekresellerproductid = json.weekresellerproductid !== undefined ? json.weekresellerproductid : "not set";
                    const monthresellerproductid = json.monthresellerproductid !== undefined ? json.monthresellerproductid : "not set";
                    const liferesellerproductid = json.liferesellerproductid !== undefined ? json.liferesellerproductid : "not set";
                    const cooldown = json.cooldown !== undefined ? json.cooldown : "not set";

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(json.message)
                                .addFields(
                                    { name: 'Enabled', value: enabled },
                                    { name: 'HWID Lock', value: hwidlock },
                                    { name: 'Version', value: version },
                                    { name: 'Download', value: download },
                                    { name: 'Web Download', value: webdownload },
                                    { name: 'Webhook', value: webhook },
                                    { name: 'Reseller Store', value: resellerstore },
                                    { name: 'Disabled Message', value: disabledmsg },
                                    { name: 'Username Taken Message', value: usernametakenmsg },
                                    { name: 'License Invalid Message', value: licenseinvalidmsg },
                                    { name: 'Key Taken Message', value: keytakenmsg },
                                    { name: 'No Subscription Message', value: nosubmsg },
                                    { name: 'Invalid Username Message', value: userinvalidmsg },
                                    { name: 'Password Invalid Message', value: passinvalidmsg },
                                    { name: 'HWID Mismatch Message', value: hwidmismatchmsg },
                                    { name: 'No Active Subscription Message', value: noactivesubmsg },
                                    { name: 'Blacklisted Message', value: blackedmsg },
                                    { name: 'Paused Message', value: pausedmsg },
                                    { name: 'Sellix Secret', value: sellixsecret },
                                    { name: 'Day Reseller Product ID', value: dayresellerproductid },
                                    { name: 'Week Reseller Product ID', value: weekresellerproductid },
                                    { name: 'Month Reseller Product ID', value: monthresellerproductid },
                                    { name: 'Lifetime Reseller Product ID', value: liferesellerproductid },
                                    { name: 'Cooldown', value: cooldown + ' seconds' },
                                )
                        ]
                    });
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }

            })
    },
};