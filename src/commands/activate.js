const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("activate")
        .setDescription("Activate License Key")
        .setDescriptionLocalizations({
            "en-US": "Activate License Key",
            "fi": "Aktivoi lisenssikoodi",
            "fr": "Activer la clé de licence",
            "de": "Aktivieren Sie den Lizenzschlüssel",
            "it": "Attiva la chiave di licenza",
            "nl": "Activeer licentiesleutel",
            "ru": "Активировать лицензионный ключ",
            "pl": "Aktywuj klucz licencyjny",
            "tr": "Lisans anahtarını etkinleştir",
            "cs": "Aktivovat licenční klíč",
            "ja": "ライセンスキーを有効にする",
            "ko": "라이센스 키 활성화",
        })
        .addStringOption((option) => 
        option
            .setName("username")
            .setDescription("Enter username to register")
            .setDescriptionLocalizations({
                "en-US": "Enter username to register",
                "fi": "Syötä rekisteröitymisessä käytettävä käyttäjätunnus",
                "fr": "Entrez le nom d'utilisateur à enregistrer",
                "de": "Geben Sie den Benutzernamen ein, um sich zu registrieren",
                "it": "Inserisci il nome utente da registrare",
                "nl": "Voer de gebruikersnaam in om te registreren",
                "ru": "Введите имя пользователя для регистрации",
                "pl": "Wprowadź nazwę użytkownika do rejestracji",
                "tr": "Kayıt olmak için kullanıcı adını girin",
                "cs": "Zadejte uživatelské jméno k registraci",
                "ja": "登録するユーザー名を入力してください",
                "ko": "등록할 사용자 이름을 입력하십시오",
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("license")
            .setDescription("Enter Valid License")
            .setDescriptionLocalizations({
                "en-US": "Enter Valid License",
                "fi": "Syötä kelvollinen lisenssi",
                "fr": "Entrez une licence valide",
                "de": "Geben Sie eine gültige Lizenz ein",
                "it": "Inserisci una licenza valida",
                "nl": "Voer een geldige licentie in",
                "ru": "Введите действительную лицензию",
                "pl": "Wprowadź ważną licencję",
                "tr": "Geçerli bir lisans girin",
                "cs": "Zadejte platnou licenci",
                "ja": "有効なライセンスを入力してください",
                "ko": "유효한 라이센스를 입력하십시오",
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("password")
            .setDescription("Enter Password")
            .setDescriptionLocalizations({
                "en-US": "Enter Password",
                "fi": "Syötä salasana",
                "fr": "Entrez le mot de passe",
                "de": "Geben Sie das Passwort ein",
                "it": "Inserisci la password",
                "nl": "Voer het wachtwoord in",
                "ru": "Введите пароль",
                "pl": "Wprowadź hasło",
                "tr": "Şifreyi girin",
                "cs": "Zadejte heslo",
                "ja": "パスワードを入力してください",
                "ko": "비밀번호를 입력하십시오",
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
    
        let un = interaction.options.getString("username")
        let pw = interaction.options.getString("password")
        let key = interaction.options.getString("license")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=activate&user=${un}&key=${key}&pass=${pw}&format=text`)
        .then(res => res.json())
        .then(json => {
		if(json.success) {
			interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle('License Successfully Activated!').addFields([{ name: 'License Activated:', value: `${key}`}]).setColor(Colors.Green).setTimestamp()], ephemeral: true})
        }
		else
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`}]).setColor(Colors.Red).setTimestamp()], ephemeral: true})
        }
		})
    },
};