const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-blacklist")
      .setDescription("Add blacklist")
      .setDescriptionLocalizations({
        "en-US": "Add blacklist",
        fi: "Lisää musta lista",
        fr: "Ajouter une liste noire",
        de: "Schwarze Liste hinzufügen",
        it: "Aggiungi blacklist",
        nl: "Zwarte lijst toevoegen",
        ru: "Добавить черный список",
        pl: "Dodaj czarną listę",
        tr: "Kara listeye ekle",
        cs: "Přidat černou listinu",
        ja: "ブラックリストを追加する",
        ko: "블랙리스트 추가",
      })
    .addStringOption((option) =>
        option
            .setName("ip")
            .setDescription("IP Address you want to blacklist")
            .setDescriptionLocalizations({
              "en-US": "IP Address you want to blacklist",
              fi: "IP-osoite, jonka haluat mustalle listalle",
              fr: "Adresse IP que vous souhaitez ajouter à la liste noire",
              de: "IP-Adresse, die Sie auf die schwarze Liste setzen möchten",
              it: "Indirizzo IP che si desidera aggiungere alla blacklist",
              nl: "IP-adres dat u op de zwarte lijst wilt zetten",
              ru: "IP-адрес, который вы хотите добавить в черный список",
              pl: "Adres IP, który chcesz dodać do czarnej listy",
              tr: "Kara listeye eklemek istediğiniz IP adresi",
              cs: "IP adresa, kterou chcete přidat do černé listiny",
              ja: "ブラックリストに追加したいIPアドレス",
              ko: "블랙리스트에 추가하려는 IP 주소",
            })
            .setRequired(false),
    )
    .addStringOption((option) =>
        option
            .setName("hwid")
            .setDescription("Hardware-ID you want to blacklist")
            .setDescriptionLocalizations({
              "en-US": "Hardware-ID you want to blacklist",
              fi: "Laitteiston tunnus, jonka haluat mustalle listalle",
              fr: "ID matériel que vous souhaitez ajouter à la liste noire",
              de: "Hardware-ID, die Sie auf die schwarze Liste setzen möchten",
              it: "ID hardware che si desidera aggiungere alla blacklist",
              nl: "Hardware-ID die u op de zwarte lijst wilt zetten",
              ru: "Идентификатор аппаратного обеспечения, который вы хотите добавить в черный список",
              pl: "ID sprzętu, który chcesz dodać do czarnej listy",
              tr: "Kara listeye eklemek istediğiniz donanım kimliği",
              cs: "ID hardwaru, který chcete přidat do černé listiny",
              ja: "ブラックリストに追加したいハードウェアID",
              ko: "블랙리스트에 추가하려는 하드웨어 ID",
            })
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("region")
            .setDescription("Region you want to blacklist")
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("country")
            .setDescription("Country you want to blacklist")
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("asn")
            .setDescription("ASN you want to blacklist")
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("reason")
            .setDescription("Reason for blacklist")
            .setRequired(false)
    ),
  async execute(interaction) {
    let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
    let ephemeral = !interaction.guild ? false : true;

    let sellerkey = await db.get(`token_${idfrom}`);
    if (sellerkey === null)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\`, then \`/set-application\` Commands First.`,
            )
            .setColor(Colors.Red)
            .setTimestamp(),
        ],
        ephemeral: ephemeral,
      });

    let ip = interaction.options.getString("ip");
    let hwid = interaction.options.getString("hwid");
    let region = interaction.options.getString("region");
    let country = interaction.options.getString("country");
    let asn = interaction.options.getString("asn");
    let reason = interaction.options.getString("reason");

    if (!ip && !hwid && !region && !country && !asn) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `You need to define at least one paramater to blacklist. Please try again defining one of these paramaters: ip, hwid, region, country, asn.`,
            )
            .setColor(Colors.Red)
            .setTimestamp(),
        ],
        ephemeral: ephemeral,
      });
    }

    let url = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=black`;

    if (ip) url += `&ip=${ip}`;
    if (hwid) url += `&hwid=${hwid}`;
    if (region) url += `&region=${region}`;
    if (country) url += `&country=${country}`;
    if (asn) url += `&asn=${asn}`;
    if (reason) url += `&reason=${encodeURIComponent(reason)}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(json.message)
                .setColor(Colors.Green)
                .setTimestamp(),
            ],
            ephemeral: ephemeral,
          });
        } else {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(json.message)
                .addFields([
                  {
                    name: "Note:",
                    value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.`,
                  },
                ])
                .setColor(Colors.Red)
                .setTimestamp()
                .setFooter({ text: "KeyAuth Discord Bot" }),
            ],
            ephemeral: ephemeral,
          });
        }
      });
  },
};