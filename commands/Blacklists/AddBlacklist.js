const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-blacklist")
        .setDescription("Add blacklist")
        .setDescriptionLocalizations({
            "en-US": "Add blacklist",
            "fi": "Lisää musta lista",
            "fr": "Ajouter une liste noire",
            "de": "Schwarze Liste hinzufügen",
            "it": "Aggiungi blacklist",
            "nl": "Zwarte lijst toevoegen",
            "ru": "Добавить черный список",
            "pl": "Dodaj czarną listę",
            "tr": "Kara listeye ekle",
            "cs": "Přidat černou listinu",
            "ja": "ブラックリストを追加する",
            "ko": "블랙리스트 추가",
        })
        .addStringOption((option) =>
            option
                .setName("ip")
                .setDescription("IP Address you want to blacklist")
                .setDescriptionLocalizations({
                    "en-US": "IP Address you want to blacklist",
                    "fi": "IP-osoite, jonka haluat mustalle listalle",
                    "fr": "Adresse IP que vous souhaitez ajouter à la liste noire",
                    "de": "IP-Adresse, die Sie auf die schwarze Liste setzen möchten",
                    "it": "Indirizzo IP che si desidera aggiungere alla blacklist",
                    "nl": "IP-adres dat u op de zwarte lijst wilt zetten",
                    "ru": "IP-адрес, который вы хотите добавить в черный список",
                    "pl": "Adres IP, który chcesz dodać do czarnej listy",
                    "tr": "Kara listeye eklemek istediğiniz IP adresi",
                    "cs": "IP adresa, kterou chcete přidat do černé listiny",
                    "ja": "ブラックリストに追加したいIPアドレス",
                    "ko": "블랙리스트에 추가하려는 IP 주소"
                })
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("hwid")
                .setDescription("Hardware-ID you want to blacklist")
                .setDescriptionLocalizations({
                    "en-US": "Hardware-ID you want to blacklist",
                    "fi": "Laitteiston tunnus, jonka haluat mustalle listalle",
                    "fr": "ID matériel que vous souhaitez ajouter à la liste noire",
                    "de": "Hardware-ID, die Sie auf die schwarze Liste setzen möchten",
                    "it": "ID hardware che si desidera aggiungere alla blacklist",
                    "nl": "Hardware-ID die u op de zwarte lijst wilt zetten",
                    "ru": "Идентификатор аппаратного обеспечения, который вы хотите добавить в черный список",
                    "pl": "ID sprzętu, który chcesz dodać do czarnej listy",
                    "tr": "Kara listeye eklemek istediğiniz donanım kimliği",
                    "cs": "ID hardwaru, který chcete přidat do černé listiny",
                    "ja": "ブラックリストに追加したいハードウェアID",
                    "ko": "블랙리스트에 추가하려는 하드웨어 ID"
                })
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let ip = interaction.options.getString("ip")
        let hwid = interaction.options.getString("hwid")

        if (!ip && !hwid) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`You need to either define hwid or ip paramater. Please try again defining one of these paramaters..`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
        }
        if (ip && hwid) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Please only define one paramater per command..`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })
        }

        let url = null;
        if (ip) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=black&ip=${ip}`;
        if (hwid) url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=black&hwid=${hwid}`;

        fetch(url)
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