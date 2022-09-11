const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetall")
        .setDescription("Reset all user's hwid")
        .setDescriptionLocalizations({
            "en-US": "Reset all user's hwid",
            "fi": "Nollaa kaikkien käyttäjien hwid",
            "fr": "Réinitialiser l'identifiant matériel de tous les utilisateurs",
            "de": "Setzen Sie die Hardware-ID aller Benutzer zurück",
            "it": "Reimposta l'ID hardware di tutti gli utenti",
            "nl": "Reset alle gebruikers hwid",
            "ru": "Сбросить идентификатор аппаратного обеспечения всех пользователей",
            "pl": "Zresetuj wszystkie identyfikatory sprzętu użytkowników",
            "tr": "Tüm kullanıcının donanım kimliğini sıfırlayın",
            "cs": "Obnovte identifikátor hardwaru všech uživatelů",
            "ja": "すべてのユーザーのハードウェアIDをリセットします",
            "ko": "모든 사용자의 하드웨어 ID를 재설정합니다",
        }),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetalluser`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: true})
        }
        else
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
        }
        })
    },
};