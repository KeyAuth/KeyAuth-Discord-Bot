const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset-password")
        .setDescription("Reset password of user")
        .setDescriptionLocalizations({
            "en-US": "Reset password of user",
            "fi": "Nollaa käyttäjän salasana",
            "fr": "Réinitialiser le mot de passe de l'utilisateur",
            "de": "Passwort des Benutzers zurücksetzen",
            "it": "Reimposta la password dell'utente",
            "nl": "Wachtwoord van gebruiker resetten",
            "ru": "Сброс пароля пользователя",
            "pl": "Zresetuj hasło użytkownika",
            "tr": "Kullanıcının şifresini sıfırla",
            "cs": "Obnovit heslo uživatele",
            "ja": "ユーザーのパスワードをリセットする",
            "ko": "사용자의 비밀번호 재설정",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Username of user you're resetting password of")
                .setDescriptionLocalizations({
                    "en-US": "Username of user you're resetting password of",
                    "fi": "Käyttäjänimi, jonka salasanaa nollaat",
                    "fr": "Nom d'utilisateur de l'utilisateur dont vous réinitialisez le mot de passe",
                    "de": "Benutzername des Benutzers, dessen Passwort Sie zurücksetzen",
                    "it": "Nome utente dell'utente di cui si sta reimpostando la password",
                    "nl": "Gebruikersnaam van de gebruiker wiens wachtwoord u opnieuw instelt",
                    "ru": "Имя пользователя пользователя, пароль которого вы сбрасываете",
                    "pl": "Nazwa użytkownika użytkownika, którego hasło resetujesz",
                    "tr": "Şifresini sıfırladığınız kullanıcının kullanıcı adı",
                    "cs": "Uživatelské jméno uživatele, jehož heslo obnovujete",
                    "ja": "パスワードをリセットするユーザーのユーザー名",
                    "ko": "비밀번호를 재설정하는 사용자의 사용자 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("pass")
                .setDescription("Password for user (optional) if not set, will be set later on login - (default = passwd)")
                .setDescriptionLocalizations({
                    "en-US": "Password for user (optional) if not set, will be set later on login",
                    "fi": "Käyttäjän salasana (valinnainen) jos ei aseteta, asetetaan myöhemmin kirjautumisen yhteydessä",
                    "fr": "Mot de passe pour l'utilisateur. S'il n'est pas défini, il est défini plus tard lors de la connexion",
                    "de": "Passwort für Benutzer (optional) wenn nicht festgelegt, wird es später beim Anmelden festgelegt",
                    "it": "Password per l'utente (opzionale) se non impostata, verrà impostata successivamente durante il login",
                    "nl": "Wachtwoord voor gebruiker. Als het niet is ingesteld, wordt het later ingesteld bij het inloggen",
                    "ru": "Пароль для пользователя. Если не установлено, оно устанавливается позже при входе в систему",
                    "pl": "Hasło dla użytkownika. Jeśli nie jest ustawiony, zostanie ustawiony później podczas logowania",
                    "tr": "Kullanıcı için şifre (isteğe bağlı) ayarlanmamışsa, giriş yaptığınızda daha sonra ayarlanacaktır",
                    "cs": "Heslo pro uživatele (volitelné), pokud není nastaveno, bude nastaveno později při přihlášení",
                    "ja": "ユーザーのパスワード（オプション）設定されていない場合は、ログイン時に後で設定されます",
                    "ko": "사용자의 비밀번호 (선택 사항) 설정되지 않은 경우 나중에 로그인 할 때 설정됩니다",
                })
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")
        let pass = interaction.options.getString("pass") || "passwd";

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetpw&user=${user}&passwd=${pass}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};