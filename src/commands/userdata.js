const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userdata")
        .setDescription("Retrieve info from a user")
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Specify user to lookup")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = null;

        if (interaction.guild == null)
            idfrom = interaction.user.id;
        else
            idfrom = interaction.guild.id;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true })

        let user = interaction.options.getString("user")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=userdata&user=${user}`)
            .then(res => res.json())
            .then(json => {
                if (!json.success) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true })
                let hwid = json.hwid ?? "N/A";
                let ip = json.ip ?? "N/A";
                let lastlogin = (json.lastlogin !== null && json.lastlogin !== undefined) ? `<t:${json.lastlogin}:f>` : "N/A";
                let expiry = "N/A";
                let subscription = "N/A";
                if (json.subscriptions.length !== 0) {
                    expiry = (json.subscriptions[0].expiry !== null && json.subscriptions[0].expiry !== undefined) ? `<t:${json['subscriptions'][0]['expiry']}:f>` : "N/A";
                    subscription = (json.subscriptions[0].subscription !== null && json.subscriptions[0].subscription !== undefined) ? json.subscriptions[0].subscription : "N/A";
                }

                const embed = new Discord.EmbedBuilder()
                    .setTitle(`User data for ${user}`)
                    .addFields([
                        { name: 'Expiry:', value: `${expiry}` },
                        { name: 'Subscription name:', value: `${subscription}` },
                        { name: 'Last Login:', value: `${lastlogin}` },
                        { name: 'HWID:', value: `${hwid}` },
                        { name: 'Created On:', value: `<t:${json['createdate']}:f>` },
                        { name: 'IP Address:', value: `${ip}` },
                    ])
                    .setColor(Colors.Blue)
                    .setTimestamp()

                interaction.editReply({ embeds: [embed], ephemeral: true })
            })
    },
};