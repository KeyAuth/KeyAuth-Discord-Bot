const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-subscription")
        .setDescription("Add Subscription")
        .setDescriptionLocalizations({
            "en-US": "Add Subscription",
            "fi": "Lisää tilaus",
            "fr": "Ajouter une abonnement",
            "de": "Abonnement hinzufügen",
            "it": "Aggiungi abbonamento",
            "nl": "Abonnement toevoegen",
            "ru": "Добавить подписку",
            "pl": "Dodaj subskrypcję",
            "tr": "Abonelik ekle",
            "cs": "Přidat předplatné",
            "ja": "サブスクリプションを追加する",
            "ko": "구독 추가",
        })
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Subscription Name?")
                .setDescriptionLocalizations({
                    "en-US": "Subscription Name?",
                    "fi": "Tilausnimi?",
                    "fr": "Nom de l'abonnement?",
                    "de": "Abonnementname?",
                    "it": "Nome dell'abbonamento?",
                    "nl": "Abonnementnaam?",
                    "ru": "Название подписки?",
                    "pl": "Nazwa subskrypcji?",
                    "tr": "Abonelik adı?",
                    "cs": "Název předplatného?",
                    "ja": "サブスクリプション名？",
                    "ko": "구독 이름?",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("level")
                .setDescription("Subscription Level?")
                .setDescriptionLocalizations({
                    "en-US": "Subscription Level?",
                    "fi": "Tilaustaso?",
                    "fr": "Niveau d'abonnement?",
                    "de": "Abonnementstufe?",
                    "it": "Livello di abbonamento?",
                    "nl": "Abonnementsniveau?",
                    "ru": "Уровень подписки?",
                    "pl": "Poziom subskrypcji?",
                    "tr": "Abonelik seviyesi?",
                    "cs": "Úroveň předplatného?",
                    "ja": "サブスクリプションレベル？",
                    "ko": "구독 레벨?",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let subname = interaction.options.getString("name")
        let sublevel = interaction.options.getString("level")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addsub&name=${subname}&level=${sublevel}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                }
            })
    },
};