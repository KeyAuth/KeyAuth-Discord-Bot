const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("addsub")
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
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let subname = interaction.options.getString("name")
        let sublevel = interaction.options.getString("level")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addsub&name=${subname}&level=${sublevel}`)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            }
        })
    },
};