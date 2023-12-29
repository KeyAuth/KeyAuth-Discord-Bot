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
                    const version = json.version;
                    const download = json.download;
                    const webdownload = json.webdownload;
                    const webhook = json.webhook;
                    const resellerstore = json.resellerstore;
                    const disabledmsg = json.disabledmsg;
                    const usernametakenmsg = json.usernametakenmsg;
                    const licenseinvalidmsg = json.licenseinvalidmsg;
                    const keytakenmsg = json.keytakenmsg;
                    const nosubmsg = json.nosubmsg;
                    const userinvalidmsg = json.userinvalidmsg;
                    const passinvalidmsg = json.passinvalidmsg;
                    const hwidmismatchmsg = json.hwidmismatchmsg;
                    const noactivesubmsg = json.noactivesubmsg;
                    const blackedmsg = json.blackedmsg;
                    const pausedmsg = json.pausedmsg;
                    const sellixsecret = json.sellixsecret;
                    const dayresellerproductid = json.dayresellerproductid;
                    const weekresellerproductid = json.weekresellerproductid;
                    const monthresellerproductid = json.monthresellerproductid;
                    const liferesellerproductid = json.liferesellerproductid;
                    const cooldown = json.cooldown;

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
                    })

                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "keyauth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }

            })
    },
};