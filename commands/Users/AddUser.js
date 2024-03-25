const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-user")
        .setDescription("Add user to application")
        .setDescriptionLocalizations({
            "en-US": "Add user to application",
            "fi": "Lisää käyttäjä sovellukseen",
            "fr": "Ajouter un utilisateur à l'application",
            "de": "Benutzer zur Anwendung hinzufügen",
            "it": "Aggiungi utente all'applicazione",
            "nl": "Gebruiker toevoegen aan applicatie",
            "ru": "Добавить пользователя в приложение",
            "pl": "Dodaj użytkownika do aplikacji",
            "tr": "Uygulamaya kullanıcı ekle",
            "cs": "Přidat uživatele do aplikace",
            "ja": "ユーザーをアプリケーションに追加",
            "ko": "응용 프로그램에 사용자 추가",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Username of user you're creating")
                .setDescriptionLocalizations({
                    "en-US": "Username of user you're creating",
                    "fi": "Luomasi käyttäjän käyttäjätunnus",
                    "fr": "Nom d'utilisateur de l'utilisateur que vous créez",
                    "de": "Benutzername des Benutzers, den Sie erstellen",
                    "it": "Nome utente dell'utente che stai creando",
                    "nl": "Gebruikersnaam van de gebruiker die u aanmaakt",
                    "ru": "Имя пользователя пользователя, которого вы создаете",
                    "pl": "Nazwa użytkownika użytkownika, którego tworzysz",
                    "tr": "Oluşturduğunuz kullanıcının kullanıcı adı",
                    "cs": "Uživatelské jméno uživatele, které vytváříte",
                    "ja": "作成しているユーザーのユーザー名",
                    "ko": "만드는 사용자의 사용자 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("sub")
                .setDescription("Name of subscription you want to assign user upon creation")
                .setDescriptionLocalizations({
                    "en-US": "Name of subscription you want to assign user upon creation",
                    "fi": "Nimi tilauksesta, jonka haluat määrittää käyttäjälle luomisen yhteydessä",
                    "fr": "Nom de l'abonnement que vous souhaitez attribuer à l'utilisateur lors de la création",
                    "de": "Name der Abonnement, das Sie dem Benutzer bei der Erstellung zuweisen möchten",
                    "it": "Nome dell'abbonamento che desideri assegnare all'utente durante la creazione",
                    "nl": "Naam van het abonnement dat u aan de gebruiker wilt toewijzen bij het aanmaken",
                    "ru": "Название подписки, которую вы хотите назначить пользователю при создании",
                    "pl": "Nazwa subskrypcji, którą chcesz przypisać użytkownikowi podczas tworzenia",
                    "tr": "Oluştururken kullanıcıya atamak istediğiniz abonelik adı",
                    "cs": "Název předplatného, který chcete při vytváření přiřadit uživateli",
                    "ja": "作成時にユーザーに割り当てるサブスクリプションの名前",
                    "ko": "만들 때 사용자에게 할당 할 구독 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("expires")
                .setDescription("Number in days until subscription assigned upon creation expires")
                .setDescriptionLocalizations({
                    "en-US": "Number in days until subscription assigned upon creation expires",
                    "fi": "Luku päivissä, kunnes luomisen yhteydessä määritetty tilaus vanhenee",
                    "fr": "Nombre de jours jusqu'à l'expiration de l'abonnement attribué lors de la création",
                    "de": "Anzahl der Tage, bis das bei der Erstellung zugewiesene Abonnement abläuft",
                    "it": "Numero di giorni fino alla scadenza dell'abbonamento assegnato durante la creazione",
                    "nl": "Aantal dagen tot het abonnement dat bij het aanmaken is toegewezen, verloopt",
                    "ru": "Количество дней до истечения срока действия подписки, назначенной при создании",
                    "pl": "Liczba dni do wygaśnięcia subskrypcji przypisanej podczas tworzenia",
                    "tr": "Oluşturulduğunda atanan abonelik süresinin dolmasına kadar gün sayısı",
                    "cs": "Počet dní do vypršení předplatného přiřazeného při vytváření",
                    "ja": "作成時に割り当てられたサブスクリプションの有効期限までの日数",
                    "ko": "만들 때 할당 된 구독 만료까지의 일 수",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("pass")
                .setDescription("Password for user (optional) if not set, will be set later on login")
                .setDescriptionLocalizations({
                    "en-US": "Password for user (optional) if not set, will be set later on login",
                    "fi": "Salasana käyttäjälle. Jos ei ole asetettu, asetetaan myöhemmin sisäänkirjautumisen yhteydessä",
                    "fr": "Mot de passe pour l'utilisateur. S'il n'est pas défini, il est défini plus tard lors de la connexion",
                    "de": "Passwort für Benutzer (optional) Wenn nicht festgelegt, wird es später beim Anmelden festgelegt",
                    "it": "Password per l'utente (opzionale) se non impostata, verrà impostata successivamente durante il login",
                    "nl": "Wachtwoord voor gebruiker (optioneel) als niet ingesteld, wordt later ingesteld bij aanmelden",
                    "ru": "Пароль для пользователя. Если не установлено, оно устанавливается позже при входе в систему",
                    "pl": "Hasło dla użytkownika. Jeśli nie jest ustawiony, zostanie ustawiony później podczas logowania",
                    "tr": "Kullanıcı için şifre (isteğe bağlı) ayarlanmamışsa, giriş yaptıktan sonra ayarlanır",
                    "cs": "Heslo pro uživatele (volitelné), pokud není nastaveno, bude nastaveno později při přihlášení",
                    "ja": "ユーザーのパスワード（オプション）設定されていない場合は、ログイン後に設定されます",
                    "ko": "사용자의 비밀번호 (선택 사항) 설정되지 않은 경우 로그인 후 설정됩니다",
                })
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")
        let pass = interaction.options.getString("pass")
        let sub = interaction.options.getString("sub")
        let expires = interaction.options.getString("expires")

        let url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=adduser&user=${user}&sub=${sub}&expiry=${expires}&pass=${pass}`
        if (!pass)
            url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=adduser&user=${user}&sub=${sub}&expiry=${expires}`

        fetch(url)
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