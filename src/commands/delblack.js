const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delblack")
        .setDescription("Delete blacklist")
        .setDescriptionLocalizations({
            "en-US": "Delete blacklist",
            "fi": "Poista musta lista",
            "fr": "Supprimer la liste noire",
            "de": "Schwarze Liste löschen",
            "it": "Elimina blacklist",
            "nl": "Verwijder zwarte lijst",
            "ru": "Удалить черный список",
            "pl": "Usuń czarną listę",
            "tr": "Kara listeyi sil",
            "cs": "Odstranit černou listinu",
            "ja": "ブラックリストを削除する",
            "ko": "블랙리스트 삭제",
        })
        .addStringOption((option) => 
        option
            .setName("ip")
            .setDescription("IP Address you want to remove from blacklist")
            .setDescriptionLocalizations({
                "en-US": "IP Address you want to remove from blacklist",
                "fi": "IP-osoite, jonka haluat poistaa mustasta listasta",
                "fr": "Adresse IP que vous souhaitez supprimer de la liste noire",
                "de": "IP-Adresse, die Sie von der schwarzen Liste entfernen möchten",
                "it": "Indirizzo IP che si desidera rimuovere dalla blacklist",
                "nl": "IP-adres dat u wilt verwijderen van de zwarte lijst",
                "ru": "IP-адрес, который вы хотите удалить из черного списка",
                "pl": "Adres IP, który chcesz usunąć z czarnej listy",
                "tr": "Kara listeden kaldırmak istediğiniz IP adresi",
                "cs": "IP adresa, kterou chcete odstranit z černé listiny",
                "ja": "ブラックリストから削除したいIPアドレス",
                "ko": "블랙리스트에서 제거하려는 IP 주소",
            })
            .setRequired(false)
        )
        .addStringOption((option) => 
        option
            .setName("hwid")
            .setDescription("Hardware-ID you want to remove from blacklist")
            .setDescriptionLocalizations({
                "en-US": "Hardware-ID you want to remove from blacklist",
                "fi": "Laitteiston tunnus, jonka haluat poistaa mustasta listasta",
                "fr": "ID matériel que vous souhaitez supprimer de la liste noire",
                "de": "Hardware-ID, die Sie von der schwarzen Liste entfernen möchten",
                "it": "ID hardware che si desidera rimuovere dalla blacklist",
                "nl": "Hardware-ID die u wilt verwijderen van de zwarte lijst",
                "ru": "Идентификатор аппаратного обеспечения, который вы хотите удалить из черного списка",
                "pl": "ID sprzętu, który chcesz usunąć z czarnej listy",
                "tr": "Kara listeden kaldırmak istediğiniz donanım kimliği",
                "cs": "ID hardwaru, který chcete odstranit z černé listiny",
                "ja": "ブラックリストから削除したいハードウェアID",
                "ko": "블랙리스트에서 제거하려는 하드웨어 ID",
            })
            .setRequired(false)
        ),
    async execute(interaction) {
		let idfrom = null;
		let ephemeral = true;
		
		if(interaction.guild == null) {
			idfrom = interaction.user.id;
			ephemeral = false;
		}
		else {
			idfrom = interaction.guild.id;
		}
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})

        let ip = interaction.options.getString("ip")
        let hwid = interaction.options.getString("hwid")
		
		if(!ip && !hwid) {
			return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`You need to either define hwid or ip paramater. Please try again defining one of these paramaters..`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})
		}
		if(ip && hwid) {
			return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`Please only define one paramater per command..`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})
		}
		
		let url = null;
		if(ip) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delblack&data=${ip}&blacktype=ip`;
		if(hwid) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delblack&data=${hwid}&blacktype=hwid`;

        fetch(url)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral})
            }
        })
    },
};