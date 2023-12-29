const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-user-subscription")
        .setDescription("Delete user's subscription")
        .setDescriptionLocalizations({
            "en-US": "Delete user's subscription",
            "fi": "Poista käyttäjän tilaus",
            "fr": "Supprimer l'abonnement de l'utilisateur",
            "de": "Löschen Sie das Abonnement des Benutzers",
            "it": "Elimina l'abbonamento dell'utente",
            "nl": "Verwijder het abonnement van de gebruiker",
            "ru": "Удалить подписку пользователя",
            "pl": "Usuń subskrypcję użytkownika",
            "tr": "Kullanıcının aboneliğini sil",
            "cs": "Odstranit předplatné uživatele",
            "ja": "ユーザーのサブスクリプションを削除する",
            "ko": "사용자의 구독 삭제",
        })
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription("Username of user you're deleting subscription from")
                .setDescriptionLocalizations({
                    "en-US": "Username of user you're deleting subscription from",
                    "fi": "Käyttäjän käyttäjänimi, jolta poistat tilauksen",
                    "fr": "Nom d'utilisateur de l'utilisateur dont vous supprimez l'abonnement",
                    "de": "Benutzername des Benutzers, von dem Sie das Abonnement löschen",
                    "it": "Nome utente dell'utente da cui stai eliminando l'abbonamento",
                    "nl": "Gebruikersnaam van de gebruiker waarvan u het abonnement verwijdert",
                    "ru": "Имя пользователя пользователя, от которого вы удаляете подписку",
                    "pl": "Nazwa użytkownika użytkownika, z którego usuwasz subskrypcję",
                    "tr": "Aboneliğini sildiğiniz kullanıcının kullanıcı adı",
                    "cs": "Uživatelské jméno uživatele, ze kterého odstraňujete předplatné",
                    "ja": "サブスクリプションを削除するユーザーのユーザー名",
                    "ko": "구독을 삭제하는 사용자의 사용자 이름",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Name of subscription you're deleting from user")
                .setDescriptionLocalizations({
                    "en-US": "Name of subscription you're deleting from user",
                    "fi": "Tilauksen nimi, jonka poistat käyttäjältä",
                    "fr": "Nom de l'abonnement que vous supprimez de l'utilisateur",
                    "de": "Name des Abonnements, das Sie vom Benutzer löschen",
                    "it": "Nome dell'abbonamento che stai eliminando dall'utente",
                    "nl": "Naam van het abonnement dat u van de gebruiker verwijdert",
                    "ru": "Название подписки, которую вы удаляете у пользователя",
                    "pl": "Nazwa subskrypcji, którą usuwasz od użytkownika",
                    "tr": "Kullanıcıdan sildiğiniz abonelik adı",
                    "cs": "Název předplatného, který odstraňujete od uživatele",
                    "ja": "ユーザーから削除するサブスクリプションの名前",
                    "ko": "사용자에서 삭제하는 구독 이름",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("user")
        let name = interaction.options.getString("name")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delsub&user=${user}&sub=${name}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Subscription deleted:', value: `\`${name}\`` }]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.` }]).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};