const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetch-application-stats")
        .setDescription("Application Statistics")
        .setDescriptionLocalizations({
            "en-US": "Application Statistics",
            "fi": "Sovelluksen tilastot",
            "fr": "Statistiques de l'application",
            "de": "Anwendungsstatistiken",
            "it": "Statistiche dell'applicazione",
            "nl": "Applicatiestatistieken",
            "ru": "Статистика приложения",
            "pl": "Statystyki aplikacji",
            "tr": "Uygulama İstatistikleri",
            "cs": "Statistiky aplikace",
            "ja": "アプリケーションの統計",
            "ko": "응용 프로그램 통계",
        }),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=stats`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    const embed = new EmbedBuilder()
                        .setTitle('Application Statistics')
                        .addFields([
                            { name: 'Total Keys:', value: `${json['totalkeys']}` },
                            { name: 'Unused Keys:', value: `${json['unused']}` },
                            { name: 'Used Keys:', value: `${json['used']}` },
                            { name: 'Paused Keys:', value: `${json['paused']}` },
                            { name: 'Banned Keys:', value: `${json['banned']}` },
                            { name: 'Webhooks:', value: `${json['webhooks']}` },
                            { name: 'Files:', value: `${json['files']}` },
                            { name: 'Vars:', value: `${json['vars']}` },
                            { name: 'Total Accounts:', value: `${json['totalaccs']}` },
                            { name: 'Reseller Accounts:', value: `${json['resellers']}` },
                            { name: 'Manager Accounts:', value: `${json['managers']}` },
                        ])
                        .setColor(Colors.Blue).setTimestamp()


                    interaction.editReply({ embeds: [embed], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })

    },
};