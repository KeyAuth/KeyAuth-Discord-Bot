const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addtime")
        .setDescription("Add time to unused keys(use extend for used keys aka users)")
        .setDescriptionLocalizations({
            "en-US": "Add time to unused keys(use extend for used keys aka users)",
            "fi": "Lisää aikaa käyttämättömiin avaimiin (käytä extend käytettyihin avaimiin eli käyttäjiin)",
            "fr": "Ajouter du temps aux clés non utilisées (utilisez extend pour les clés utilisées, c'est-à-dire les utilisateurs)",
            "de": "Fügen Sie Zeit zu ungenutzten Schlüsseln hinzu (verwenden Sie extend für benutzte Schlüssel, also Benutzer)",
            "it": "Aggiungi tempo a chiavi non utilizzate (usa extend per chiavi utilizzate, ovvero utenti)",
            "nl": "Voeg tijd toe aan ongebruikte sleutels (gebruik extend voor gebruikte sleutels, dat wil zeggen gebruikers)",
            "ru": "Добавьте время к неиспользуемым ключам (используйте extend для использованных ключей, то есть пользователей)",
            "pl": "Dodaj czas do nieużywanych kluczy (użyj extend dla używanych kluczy, czyli użytkowników)",
            "tr": "Kullanılmayan anahtarlara zaman ekleyin (kullanılan anahtarlar için genişletmeyi kullanın, yani kullanıcılar)",
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
		
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let time = interaction.options.getString("time")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addtime&time=${time}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            } else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            }
        })
    },
};