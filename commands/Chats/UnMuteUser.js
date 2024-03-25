const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute-user")
        .setDescription("Unmute user from chat channel")
        .setDescriptionLocalizations({
            "en-US": "Unmute user from chat channel",
            "fi": "Poista käyttäjän mykistys chat-kanavalta",
            "fr": "Réactiver l'utilisateur du canal de chat",
            "de": "Stummschaltung des Benutzers im Chat-Kanal aufheben",
            "it": "Attiva l'audio dell'utente dal canale di chat",
            "nl": "Dempen van gebruiker van chatkanaal opheffen",
            "ru": "Включить пользователя из канала чата",
            "pl": "Wyłącz wyciszenie użytkownika z kanału czatu",
            "tr": "Kullanıcının sohbet kanalından sesini aç",
            "cs": "Přestat ignorovat uživatele z chatovacího kanálu",
            "ja": "チャット チャネルからユーザーのミュートを解除",
            "ko": "채팅 채널에서 사용자 음소거 해제",
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
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=unmuteuser&user=${user}`)
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