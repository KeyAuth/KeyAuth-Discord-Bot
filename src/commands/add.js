const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add key. You must specify the optional parameters the first time. After that they're saved.")
		.setDescriptionLocalizations({
			"en-US": "Add key. You must specify the optional parameters the first time. After they're saved.",
			"fi": "Lisää avain. Sinun on määritettävä valinnaiset parametrit ensimmäistä kertaa.",
			"fr": "Ajouter une clé. Vous devez spécifier les paramètres facultatifs la première fois.",
			"de": "Schlüssel hinzufügen. Sie müssen die optionalen Parameter beim ersten Mal angeben.",
			"it": "Aggiungi chiave. È necessario specificare i parametri facoltativi la prima volta.",
			"nl": "Sleutel toevoegen. U moet de eerste keer de optionele parameters opgeven.",
			"ru": "Добавить ключ. Вы должны указать необязательные параметры в первый раз. После этого они сохраняются.",
			"pl": "Dodaj klucz. Musisz określić opcjonalne parametry po raz pierwszy. Po tym są zapisywane.",
			"tr": "Anahtar ekleyin. İlk kez isteğe bağlı parametreleri belirtmeniz gerekir. Sonra kaydedilirler.",
			"cs": "Přidejte klíč. Musíte zadat volitelné parametry poprvé. Poté jsou uloženy.",
			"ja": "キーを追加します。最初にオプションのパラメータを指定する必要があります。その後、保存されます。",
			"ko": "키를 추가하십시오. 최초에 선택적 매개 변수를 지정해야합니다. 그 후 저장됩니다."
		})
        .addStringOption((option) => 
        option
            .setName("expiry")
            .setDescription("How many days?")
			.setDescriptionLocalizations({
				"en-US": "How many days?",
				"fi": "Kuinka monta päivää?",
				"fr": "Combien de jours?",
				"de": "Wie viele Tage?",
				"it": "Quanti giorni?",
				"nl": "Hoeveel dagen?",
				"ru": "Сколько дней?",
				"pl": "Ile dni?",
				"tr": "Kaç gün?",
				"cs": "Kolik dní?",
				"ja": "何日？",
				"ko": "몇 일?"
			})
            .setRequired(false)
        )
        .addStringOption((option) => 
        option
            .setName("level")
            .setDescription("What level?")
			.setDescriptionLocalizations({
				"en-US": "What level?",
				"fi": "Mikä taso?",
				"fr": "Quel niveau?",
				"de": "Welche Ebene?",
				"it": "Qual è il livello?",
				"nl": "Welk niveau?",
				"ru": "Какой уровень?",
				"pl": "Jaki poziom?",
				"tr": "Ne seviye?",
				"cs": "Jaká úroveň?",
				"ja": "どのレベル？",
				"ko": "어떤 레벨?"
			})
            .setRequired(false)
        )
        .addStringOption((option) => 
        option
            .setName("amount")
            .setDescription("What amount?")
			.setDescriptionLocalizations({
				"en-US": "What amount?",
				"fi": "Mikä määrä?",
				"fr": "Quel montant?",
				"de": "Wie viel?",
				"it": "Quanto?",
				"nl": "Hoeveel?",
				"ru": "Какая сумма?",
				"pl": "Jaka kwota?",
				"tr": "Ne kadar?",
				"cs": "Jaká částka?",
				"ja": "何量？",
				"ko": "얼마?"
			})
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
	
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let license_mask = await db.get(`licensemask_${idfrom}`)
        if(license_mask === null) license_mask = "XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX";
        
        let days = interaction.options.getString("expiry")
        let level = interaction.options.getString("level")
        let amount = interaction.options.getString("amount")

		if(amount > 20) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('Failure').addFields([{ name: 'Reason:', value: `You cannot add more than twenty keys at a time.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
		
        if(days) {
			fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=add&expiry=${days}&mask=${license_mask}&level=${level}&amount=${amount}&format=text`)
			.then(res => res.text())
			.then(text => {
				if(!text.includes("message"))
				{
					interaction.followUp({ content: `${text}`, ephemeral: true });
					db.fetch(`licenseAdd_${idfrom}`)
					db.set(`licenseAdd_${idfrom}`, `{ "days": ${days}, "level": ${level}, "amount": ${amount}}`)
				}
				else
				{
					let json = JSON.parse(text);
					interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
				}
			})
		}
		else {
			
			let licenseAdd = await db.get(`licenseAdd_${idfrom}`)
			if(licenseAdd === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`No config saved for adding licenses yet. Please do a command with paramaters included then this will work.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})
			licenseAdd = JSON.parse(licenseAdd);
		
			fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=add&expiry=${licenseAdd.days}&mask=${license_mask}&level=${licenseAdd.level}&amount=${licenseAdd.amount}&format=text`)
			.then(res => res.text())
			.then(text => {
				if(!text.includes("message"))
				{
					interaction.followUp({ content: `${text}`, ephemeral: true });
				}
				else
				{
					let json = JSON.parse(text);
					interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
				}
			})
		}
    },
};
