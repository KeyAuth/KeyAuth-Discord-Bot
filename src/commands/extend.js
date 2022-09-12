const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("extend")
        .setDescription("Extend User")
        .setDescriptionLocalizations({
            "en-US": "Extend User",
            "fi": "Pidentä käyttäjää",
            "fr": "Étendre l'utilisateur",
            "de": "Benutzer erweitern",
            "it": "Estendi utente",
            "nl": "Gebruiker uitbreiden",
            "ru": "Расширить пользователя",
            "pl": "Rozszerz użytkownika",
            "tr": "Kullanıcıyı uzat",
            "cs": "Rozšířit uživatele",
            "ja": "ユーザーを拡張する",
            "ko": "사용자 확장",
        })
        .addStringOption((option) => 
        option
            .setName("username")
            .setDescription("Enter username to extend")
            .setDescriptionLocalizations({
                "en-US": "Enter username to extend",
                "fi": "Anna käyttäjätunnus jatkaa",
                "fr": "Entrez le nom d'utilisateur à étendre",
                "de": "Geben Sie den Benutzernamen ein, um ihn zu erweitern",
                "it": "Inserisci il nome utente da estendere",
                "nl": "Voer de gebruikersnaam in om uit te breiden",
                "ru": "Введите имя пользователя, чтобы расширить",
                "pl": "Wprowadź nazwę użytkownika, aby ją rozszerzyć",
                "tr": "Uzatmak için kullanıcı adını girin",
                "cs": "Zadejte uživatelské jméno, abyste jej rozšířili",
                "ja": "拡張するユーザー名を入力してください",
                "ko": "확장 할 사용자 이름을 입력하십시오"
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("subname")
            .setDescription("Enter Subscription Name")
            .setDescriptionLocalizations({
                "en-US": "Enter Subscription Name",
                "fi": "Anna tilausnimi",
                "fr": "Entrez le nom de l'abonnement",
                "de": "Geben Sie den Abonnementsnamen ein",
                "it": "Inserisci il nome dell'abbonamento",
                "nl": "Voer de abonnementsnaam in",
                "ru": "Введите название подписки",
                "pl": "Wprowadź nazwę subskrypcji",
                "tr": "Abonelik adını girin",
                "cs": "Zadejte název odběru",
                "ja": "サブスクリプション名を入力してください",
                "ko": "구독 이름을 입력하십시오"
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("expiry")
            .setDescription("Enter Days Subscription Should Last")
            .setDescriptionLocalizations({
                "en-US": "Enter Days Subscription Should Last",
                "fi": "Anna päivät, jolloin tilaus pitäisi kestää",
                "fr": "Entrez les jours pendant lesquels l'abonnement devrait durer",
                "de": "Geben Sie die Tage ein, an denen die Abonnementdauer enden soll",
                "it": "Inserisci i giorni in cui l'abbonamento dovrebbe durare",
                "nl": "Voer de dagen in waarop de abonnementsduur moet eindigen",
                "ru": "Введите дни, в течение которых должна длиться подписка",
                "pl": "Wprowadź dni, w których subskrypcja powinna trwać",
                "tr": "Abonelik süresinin ne kadar süreceğini girin",
                "cs": "Zadejte dny, po které má trvat doba platnosti odběru",
                "ja": "サブスクリプションの有効期間がどのくらい続くかを入力してください",
                "ko": "구독 기간이 얼마나 지속되어야 하는지 입력하십시오"
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
        let subname = interaction.options.getString("subname")
        let days = interaction.options.getString("expiry")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=extend&user=${un}&sub=${subname}&expiry=${days}`)
        .then(res => res.json())
        .then(json => {
			if (json.success)
            {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{name: 'User Extended:', value: `${un}`}]).setColor(Colors.Green).setTimestamp()], ephemeral: true})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};