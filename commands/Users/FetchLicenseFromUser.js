const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-license-from-user")
        .setDescription("Get License from user")
        .setDescriptionLocalizations({
            "en-US": "Get License from user",
            "fi": "Hae lisenssi käyttäjältä",
            "fr": "Obtenir une licence de l'utilisateur",
            "de": "Lizenz von Benutzer erhalten",
            "it": "Ottieni licenza dall'utente",
            "nl": "Licentie van gebruiker ophalen",
            "ru": "Получить лицензию от пользователя",
            "pl": "Uzyskaj licencję od użytkownika",
            "tr": "Kullanıcıdan lisans al",
            "cs": "Získejte licenci od uživatele",
            "ja": "ユーザーからライセンスを取得する",
            "ko": "사용자로부터 라이센스 가져 오기",
        })
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Username where you want the license")
                .setDescriptionLocalizations({
                    "en-US": "Username where you want the license",
                    "fi": "Käyttäjätunnus, johon haluat lisenssin",
                    "fr": "Nom d'utilisateur où vous souhaitez la licence",
                    "de": "Benutzername, an dem Sie die Lizenz möchten",
                    "it": "Nome utente dove vuoi la licenza",
                    "nl": "Gebruikersnaam waar u de licentie wilt",
                    "ru": "Имя пользователя, где вы хотите лицензию",
                    "pl": "Nazwa użytkownika, w której chcesz licencję",
                    "tr": "Lisans istediğiniz kullanıcı adı",
                    "cs": "Uživatelské jméno, kde chcete licenci",
                    "ja": "ライセンスを取得したいユーザー名",
                    "ko": "라이센스를 원하는 사용자 이름",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let un = interaction.options.getString("username")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=getkey&user=${un}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`License From ${un}`).addFields([{ name: 'License:', value: `\`${json['key']}\`` }]).setColor(Colors.Blue).setTimestamp()], ephemeral: ephemeral })
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Failure`).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }

            })
    },
};