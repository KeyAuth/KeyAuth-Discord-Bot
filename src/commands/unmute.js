const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Unmute user so they can send messages before their mute time is up")
        .setDescriptionLocalizations({
            "en-US": "Unmute user so they can send messages before their mute time is up",
            "fi": "Poista käyttäjän mykistys, jotta he voivat lähettää viestejä ennen kuin heidän mykistysaikansa on ohi",
            "fr": "Démutez l'utilisateur afin qu'il puisse envoyer des messages avant que leur temps de sourdine ne soit écoulé",
            "de": "Deaktivieren Sie den Benutzer, damit er Nachrichten senden kann, bevor die Zeit für die Stummschaltung abgelaufen ist",
            "it": "Disattiva l'utente in modo che possa inviare messaggi prima che il tempo di muting scada",
            "nl": "Deactiveer de gebruiker zodat ze berichten kunnen verzenden voordat hun mute-tijd is verstreken",
            "ru": "Отключите пользователя, чтобы он мог отправлять сообщения до истечения времени его отключения",
            "pl": "Wyłącz użytkownika, aby mógł wysyłać wiadomości przed upływem czasu wyciszenia",
            "tr": "Kullanıcıyı devre dışı bırakın, böylece sessizlik süresi dolmadan mesaj gönderebilir",
            "cs": "Vypněte uživatele, aby mohl posílat zprávy, než vyprší časový limit pro ztlumení",
            "ja": "ミュートされたユーザーを無効にして、ミュート時間が終了する前にメッセージを送信できるようにします",
            "ko": "사용자를 뮤트 해제하여 뮤트 시간이 지나기 전에 메시지를 보낼 수 있습니다",
        })
        .addStringOption((option) => 
        option
            .setName("user")
            .setDescription("The user's username")
            .setDescriptionLocalizations({
                "en-US": "The user's username",
                "fi": "Käyttäjän käyttäjätunnus",
                "fr": "Le nom d'utilisateur de l'utilisateur",
                "de": "Der Benutzername des Benutzers",
                "it": "Il nome utente dell'utente",
                "nl": "De gebruikersnaam van de gebruiker",
                "ru": "Имя пользователя пользователя",
                "pl": "Nazwa użytkownika użytkownika",
                "tr": "Kullanıcının kullanıcı adı",
                "cs": "Uživatelské jméno uživatele",
                "ja": "ユーザーのユーザー名",
                "ko": "사용자의 사용자 이름",
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

        let user = interaction.options.getString("user")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=unmuteuser&user=${user}`)
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