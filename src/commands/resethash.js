const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resethash")
        .setDescription("Reset app hash")
        .setDescriptionLocalizations({
            "en-US": "Reset app hash",
            "fi": "Nollaa sovelluksen tunniste",
            "fr": "Réinitialiser l'empreinte de l'application",
            "de": "App-Hash zurücksetzen",
            "it": "Reimposta l'hash dell'app",
            "nl": "App-hash opnieuw instellen",
            "ru": "Сбросить хэш приложения",
            "pl": "Zresetuj hash aplikacji",
            "tr": "Uygulama karmaşasını sıfırla",
            "cs": "Obnovit hash aplikace",
            "ja": "アプリのハッシュをリセットする",
            "ko": "앱 해시 재설정",
        }),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resethash`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('Hash Successfully Reset!').addFields([{name: 'Reminder:', value: `You need to reset hash each time you compile loader.`}]).setColor(Colors.Green).setTimestamp()], ephemeral: true})
        }
        else
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
        }
        })
    },
};