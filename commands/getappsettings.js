const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../utils/database')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getsettings")
        .setDescription("Get Current Settings"),
    async execute(interaction) {
        let idfrom = null;
        let ephemeral = true;

        if (interaction.guild == null) {
            idfrom = interaction.user.id;
            ephemeral = false;
        }
        else {
            idfrom = interaction.guild.id;
        }

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })


        // https://keyauth.win/api/seller/?sellerkey={sellerkey}&type=getsettings
        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=getsettings`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    /*
                    {
  "enabled": true,
  "hwid-lock": true,
  "version": "1.0",
  "download": "",
  "webdownload": "",
  "webhook": "",
  "resellerstore": "",
  "disabledmsg": "This application is disabled",
  "usernametakenmsg": "Username already taken, choose a different one",
  "licenseinvalidmsg": "Invalid license key",
  "keytakenmsg": "License key has already been used",
  "nosubmsg": "There is no subscription created for your key level. Contact application developer.",
  "userinvalidmsg": "Invalid username",
  "passinvalidmsg": "Password does not match.",
  "hwidmismatchmsg": "HWID doesn't match. Ask for a HWID reset",
  "noactivesubmsg": "No active subscription(s) found",
  "blackedmsg": "You've been blacklisted from our application",
  "pausedmsg": "",
  "sellixsecret": "",
  "dayresellerproductid": "",
  "weekresellerproductid": "",
  "monthresellerproductid": "",
  "liferesellerproductid": "",
  "cooldown": "604800"
}
                    */

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
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "mazkdevf_bot Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }

            })
    },
};