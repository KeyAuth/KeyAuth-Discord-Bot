const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editvar")
        .setDescription("Edit Variable")
        .setDescriptionLocalizations({
            "en-US": "Edit Variable",
            "fi": "Muokkaa muuttujaa",
            "fr": "Modifier la variable",
            "de": "Variable bearbeiten",
            "it": "Modifica variabile",
            "nl": "Variabele bewerken",
            "ru": "Изменить переменную",
            "pl": "Edytuj zmienną",
            "tr": "Değişkeni düzenle",
            "cs": "Upravit proměnnou",
            "ja": "変数を編集する",
            "ko": "변수 편집",
        })
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("Variable Name?")
            .setDescriptionLocalizations({
                "en-US": "Variable Name?",
                "fi": "Muuttujan nimi?",
                "fr": "Nom de la variable?",
                "de": "Variablenname?",
                "it": "Nome della variabile?",
                "nl": "Variabelenaam?",
                "ru": "Имя переменной?",
                "pl": "Nazwa zmiennej?",
                "tr": "Değişken adı?",
                "cs": "Název proměnné?",
                "ja": "変数名？",
                "ko": "변수 이름?",
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("value")
            .setDescription("Variable Value?")
            .setDescriptionLocalizations({
                "en-US": "Variable Value?",
                "fi": "Muuttujan arvo?",
                "fr": "Valeur de la variable?",
                "de": "Variablenwert?",
                "it": "Valore della variabile?",
                "nl": "Variabele waarde?",
                "ru": "Значение переменной?",
                "pl": "Wartość zmiennej?",
                "tr": "Değişken değeri?",
                "cs": "Hodnota proměnné?",
                "ja": "変数の値？",
                "ko": "변수 값?",
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

        let varname = interaction.options.getString("name")
        let varvalue = interaction.options.getString("value")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=editvar&varid=${varname}&data=${varvalue}`)
        .then(res => res.json())
        .then(json => {
			if (json.success)
            {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};