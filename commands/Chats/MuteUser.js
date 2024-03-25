const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute-user")
        .setDescription("Mute user from sending messages in chat channels")
        .setDescriptionLocalizations({
            "en-US": "Mute user from sending messages in chat channels",
            "fi": "Estä käyttäjä lähettämästä viestejä keskustelukanavissa",
            "fr": "Mute un utilisateur pour qu'il ne puisse pas envoyer de messages dans les salons de discussion",
            "de": "Stummschalten eines Benutzers, damit er keine Nachrichten in Chatkanälen senden kann",
            "it": "Silenzia un utente in modo che non possa inviare messaggi nei canali di chat",
            "nl": "Stil een gebruiker zodat hij geen berichten kan verzenden in chatkanalen",
            "ru": "Заглушить пользователя, чтобы он не мог отправлять сообщения в чат-каналах",
            "pl": "Wycisz użytkownika, aby nie mógł wysyłać wiadomości w kanałach czatu",
            "tr": "Kullanıcıyı sohbet kanallarında mesaj göndermesini engelleyin",
            "cs": "Ztlumit uživatele, aby nemohl odesílat zprávy v chatovacích kanálech",
            "ja": "ユーザーをチャットチャンネルでメッセージを送信できないようにミュートします",
            "ko": "사용자를 채팅 채널에서 메시지를 보낼 수 없도록 음소거합니다",
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
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("Time in seconds user is muted for")
                .setDescriptionLocalizations({
                    "en-US": "Time in seconds user is muted for",
                    "fi": "Aika sekunneissa, jolloin käyttäjä on hiljennetty",
                    "fr": "Temps en secondes pendant lequel l'utilisateur est muet",
                    "de": "Zeit in Sekunden, für die der Benutzer stummgeschaltet ist",
                    "it": "Tempo in secondi per cui l'utente è silenziato",
                    "nl": "Tijd in seconden waarvoor de gebruiker is gemute",
                    "ru": "Время в секундах, на которое пользователь заглушен",
                    "pl": "Czas w sekundach, na który użytkownik jest wyciszony",
                    "tr": "Kullanıcı için saniye cinsinden süre",
                    "cs": "Čas v sekundách, po kterém je uživatel ztlumen",
                    "ja": "ユーザーがミュートされている秒数",
                    "ko": "사용자가 음소거되는 시간(초)",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")
        let time = interaction.options.getString("time")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=muteuser&user=${user}&time=${time}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                }
            })
    },
};