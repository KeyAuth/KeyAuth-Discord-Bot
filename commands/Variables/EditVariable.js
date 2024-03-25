const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit-variable")
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
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let varname = interaction.options.getString("name")
        let varvalue = interaction.options.getString("value")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=editvar&varid=${varname}&data=${varvalue}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};