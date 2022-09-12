const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setvar")
        .setDescription("Assign variable to user(s)")
        .setDescriptionLocalizations({
            "en-US": "Assign variable to user(s)",
            "fi": "Määritä muuttuja käyttäjälle",
            "fr": "Assigner une variable à l'utilisateur",
            "de": "Variablen einem Benutzer zuweisen",
            "it": "Assegna variabile all'utente",
            "nl": "Wijs variabele toe aan gebruiker(s)",
            "ru": "Назначить переменную пользователю",
            "pl": "Przypisz zmienną do użytkownika",
            "tr": "Değişkeni kullanıcıya ata",
            "cs": "Přiřadit proměnnou uživateli",
            "ja": "変数をユーザーに割り当てる",
            "ko": "변수를 사용자에게 할당",
        })
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("User variable name")
            .setDescriptionLocalizations({
                "en-US": "User variable name",
                "fi": "Käyttäjän muuttujan nimi",
                "fr": "Nom de la variable utilisateur",
                "de": "Benutzervariablenname",
                "it": "Nome variabile utente",
                "nl": "Gebruikersvariabelenaam",
                "ru": "Имя переменной пользователя",
                "pl": "Nazwa zmiennej użytkownika",
                "tr": "Kullanıcı değişkeni adı",
                "cs": "Název uživatelské proměnné",
                "ja": "ユーザー変数名",
                "ko": "사용자 변수 이름",
            })
            .setRequired(true)
        )
		.addStringOption((option) => 
        option
            .setName("data")
            .setDescription("User variable data")
            .setDescriptionLocalizations({
                "en-US": "User variable data",
                "fi": "Käyttäjän muuttujan tiedot",
                "fr": "Données de la variable utilisateur",
                "de": "Benutzervariablen-Daten",
                "it": "Dati variabili utente",
                "nl": "Gebruikersvariabelengegevens",
                "ru": "Данные переменной пользователя",
                "pl": "Dane zmiennej użytkownika",
                "tr": "Kullanıcı değişkeni verileri",
                "cs": "Uživatelské proměnné",
                "ja": "ユーザー変数データ",
                "ko": "사용자 변수 데이터",
            })
            .setRequired(true)
        )
		.addStringOption((option) => 
        option
            .setName("user")
            .setDescription("User to set variable of. If you leave blank, all users will be assigned user variable")
            .setDescriptionLocalizations({
                "en-US": "User to set variable of. If you leave blank, all users will be assigned user variable",
                "fi": "Käyttäjä, jonka muuttujan haluat asettaa. Jos jätät tyhjäksi, kaikki käyttäjät saavat käyttäjän muuttujan",
                "fr": "Utilisateur dont vous souhaitez définir la variable. Si vous laissez vide, toutes les variables d'utilisateur seront affectées",
                "de": "Benutzer, dessen Variable Sie festlegen möchten. Wenn Sie es leer lassen, wird allen Benutzern die Benutzervariable zugewiesen",
                "it": "Utente di cui impostare la variabile. Se lo lasci vuoto, verrà assegnata la variabile utente a tutti gli utenti",
                "nl": "Gebruiker wiens variabele u wilt instellen. Als u het leeg laat, wordt de gebruikersvariabele aan alle gebruikers toegewezen",
                "ru": "Пользователь, переменной которого вы хотите установить. Если вы оставите это пустым, переменной пользователя будет назначена всем пользователям",
                "pl": "Użytkownik, któremu chcesz przypisać zmienną. Jeśli pozostawisz to puste, wszystkim użytkownikom zostanie przypisana zmienna użytkownika",
                "tr": "Değişkenini ayarlamak istediğiniz kullanıcı. Boş bırakırsanız, tüm kullanıcılara kullanıcı değişkeni atanır",
                "cs": "Uživatel, kterému chcete přiřadit proměnnou. Pokud to necháte prázdné, všem uživatelům bude přiřazena uživatelská proměnná",
                "ja": "変数を設定するユーザー。空のままにすると、すべてのユーザーにユーザー変数が割り当てられます",
                "ko": "변수를 설정할 사용자. 비워 두면 모든 사용자에게 사용자 변수가 할당됩니다",
            })
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		
		if(interaction.guild == null)
			idfrom = interaction.user.id;
		else
			idfrom = interaction.guild.id;
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: true})

        let name = interaction.options.getString("name")
        let data = interaction.options.getString("data")
        let user = interaction.options.getString("user") ?? "all"
		
        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=setvar&user=${user}&var=${name}&data=${data}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: true})
            } else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: true})
            }
        })
    },
};