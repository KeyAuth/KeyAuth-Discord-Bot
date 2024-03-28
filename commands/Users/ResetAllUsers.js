const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset-all-users")
        .setDescription("Reset All User's HWID")
        .setDescriptionLocalizations({
            "en-US": "Reset All User's HWID",
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
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetalluser`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};