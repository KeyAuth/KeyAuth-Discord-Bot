const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetuser")
        .setDescription("Reset a user")
        .setDescriptionLocalizations({
            "en-US": "Reset a user",
            "fi": "Nollaa käyttäjä",
            "fr": "Réinitialiser un utilisateur",
            "de": "Benutzer zurücksetzen",
            "it": "Reimposta un utente",
            "nl": "Reset een gebruiker",
            "ru": "Сбросить пользователя",
            "pl": "Zresetuj użytkownika",
            "tr": "Bir kullanıcıyı sıfırlayın",
            "cs": "Resetovat uživatele",
            "ja": "ユーザーをリセットする",
            "ko": "사용자를 재설정하십시오",
        })
        .addStringOption((option) => 
        option
            .setName("username")
            .setDescription("Specify username")
            .setDescriptionLocalizations({
                "en-US": "Specify username",
                "fi": "Määritä käyttäjänimi",
                "fr": "Spécifiez le nom d'utilisateur",
                "de": "Benutzernamen angeben",
                "it": "Specifica il nome utente",
                "nl": "Geef gebruikersnaam op",
                "ru": "Укажите имя пользователя",
                "pl": "Określ nazwę użytkownika",
                "tr": "Kullanıcı adını belirtin",
                "cs": "Zadejte uživatelské jméno",
                "ja": "ユーザー名を指定してください",
                "ko": "사용자 이름 지정",
            })
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		let ephemeral = true;
		
		if(interaction.guild == null) {
			idfrom = interaction.user.id;
			ephemeral = false;
		}
		else {
			idfrom = interaction.guild.id;
		}
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})

        let un = interaction.options.getString("username")
        
        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetuser&user=${un}`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('User Successfully Reset!').addFields([{name: 'Username:', value: `\`${un}\``}]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral})
        }
        else
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
        }
        })
    },
};