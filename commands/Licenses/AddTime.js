const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-time")
        .setDescription("Add time to unused keys(use extend for used keys aka users)")
        .setDescriptionLocalizations({
            "en-US": "Add time to unused keys(use extend for used keys aka users)",
            "fi": "Lisää aikaa käyttämättömiin avaimiin (käytä extend käytettyihin avaimiin eli käyttäjiin)",
            "fr": "Ajouter du temps aux clés inutilisées (utiliser l'extension si la clé est utilisée)",
            "de": "Fügen Sie Zeit zu nicht verwendeten Schlüsseln hinzu (verwenden Sie Extend Used on Keys)",
            "it": "Aggiungi tempo a chiavi non utilizzate (usa extend per chiavi utilizzate, ovvero utenti)",
            "nl": "Voeg tijd toe aan ongebruikte sleutels (gebruik verlengen gebruikt op sleutels)",
            "ru": "Добавьте время к неиспользуемым ключам (используйте расширение, используемое для ключей)",
            "pl": "Dodaj czas do nieużywanych kluczy (użyj extend dla używanych kluczy, czyli użytkowników)",
            "tr": "Kullanılmayan tuşlara zaman ekleyin (tuşlarda kullanılan uzatmayı kullanın)",
            "cs": "Přidejte čas k nepoužívaným klíčům (použijte extend pro použité klíče, tedy uživatele)",
            "ja": "使用されていないキーに時間を追加します（使用されているキーにはextendを使用します）",
            "ko": "사용되지 않는 키에 시간을 추가하십시오 (사용된 키에는 extend를 사용하십시오)",
        })
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("Number of days")
                .setDescriptionLocalizations({
                    "en-US": "Number of days",
                    "fi": "Päivien määrä",
                    "fr": "Nombre de jours",
                    "de": "Anzahl der Tage",
                    "it": "Numero di giorni",
                    "nl": "Aantal dagen",
                    "ru": "Количество дней",
                    "pl": "Liczba dni",
                    "tr": "Gün sayısı",
                    "cs": "Počet dnů",
                    "ja": "日数",
                    "ko": "일 수",
                })
                .setRequired(true)
        ),
    async execute(interaction) {

        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let time = interaction.options.getString("time")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addtime&time=${time}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                }
            })
    },
};