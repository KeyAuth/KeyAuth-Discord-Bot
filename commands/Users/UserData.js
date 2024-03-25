const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retrieve-user-data")
        .setDescription("Retrieve info from a user")
        .setDescriptionLocalizations({
            "en-US": "Retrieve info from a user",
            "fi": "Hae tietoja käyttäjältä",
            "fr": "Récupérer des informations sur un utilisateur",
            "de": "Informationen von einem Benutzer abrufen",
            "it": "Recupera informazioni da un utente",
            "nl": "Informatie ophalen van een gebruiker",
            "ru": "Получить информацию о пользователе",
            "pl": "Pobierz informacje o użytkowniku",
            "tr": "Bir kullanıcıdan bilgi al",
            "cs": "Získejte informace o uživateli",
            "ja": "ユーザーから情報を取得する",
            "ko": "사용자에서 정보 검색",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Specify user to lookup")
                .setDescriptionLocalizations({
                    "en-US": "Specify user to lookup",
                    "fi": "Määritä käyttäjä, jota etsitään",
                    "fr": "Spécifiez l'utilisateur à rechercher",
                    "de": "Geben Sie den Benutzer an, nach dem gesucht werden soll",
                    "it": "Specifica l'utente da cercare",
                    "nl": "Geef de gebruiker op die u wilt opzoeken",
                    "ru": "Укажите пользователя для поиска",
                    "pl": "Określ użytkownika do wyszukania",
                    "tr": "Aranacak kullanıcıyı belirtin",
                    "cs": "Zadejte uživatele, kterého chcete vyhledat",
                    "ja": "検索するユーザーを指定してください",
                    "ko": "찾을 사용자 지정",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=userdata&user=${user}`)
            .then(res => res.json())
            .then(json => {
                if (!json.success) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                let hwid = json.hwid ?? "N/A";
                let ip = json.ip ?? "N/A";
                let lastlogin = (json.lastlogin !== null && json.lastlogin !== undefined) ? `<t:${json.lastlogin}:f>` : "N/A";
                let expiry = "N/A";
                let subscription = "N/A";
                if (json.subscriptions.length !== 0) {
                    expiry = (json.subscriptions[0].expiry !== null && json.subscriptions[0].expiry !== undefined) ? `<t:${json['subscriptions'][0]['expiry']}:f>` : "N/A";
                    subscription = (json.subscriptions[0].subscription !== null && json.subscriptions[0].subscription !== undefined) ? json.subscriptions[0].subscription : "N/A";
                }

                const embed = new EmbedBuilder()
                    .setTitle(`User data for ${user}`)
                    .addFields([
                        { name: 'Expiry:', value: `${expiry}` },
                        { name: 'Subscription name:', value: `${subscription}` },
                        { name: 'Last Login:', value: `${lastlogin}` },
                        { name: 'HWID:', value: `${hwid}` },
                        { name: 'Created On:', value: `<t:${json['createdate']}:f>` },
                        { name: 'IP Address:', value: `${ip}` },
                        { name: 'Token:', value: `${json["token"]}` },
                    ])
                    .setColor(Colors.Blue)
                    .setTimestamp()

                interaction.editReply({ embeds: [embed], ephemeral: ephemeral })
            })
    },
};