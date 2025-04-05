const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit-file")
        .setDescription("Edit an existing file")
        .setDescriptionLocalizations({
            "en-US": "Edit an existing file",
            fi: "Muokkaa olemassa olevaa tiedostoa",
            fr: "Modifier un fichier existant",
            de: "Bearbeiten Sie eine vorhandene Datei",
            it: "Modifica un file esistente",
            nl: "Bewerk een bestaand bestand",
            ru: "Редактировать существующий файл",
            pl: "Edytuj istniejący plik",
            tr: "Mevcut bir dosyayı düzenle",
            cs: "Upravit existující soubor",
            ja: "既存のファイルを編集する",
            ko: "기존 파일 편집",
        })
        .addStringOption((option) =>
            option
                .setName("fileid")
                .setDescription("The ID of the file you want to edit")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("url")
                .setDescription("The new URL for the file")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("authed")
                .setDescription("Whether authentication is required to access the file")
                .setRequired(true)
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

        let fileid = interaction.options.getString("fileid");
        let url = interaction.options.getString("url");
        let authed = interaction.options.getBoolean("authed");

        fetch(
            `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=editfile&id=${fileid}&url=${url}&authed=${authed ? 1 : 0}`
        )
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("File Updated Successfully")
                                .setDescription(json.message)
                                .setColor(Colors.Green)
                                .setTimestamp(),
                        ],
                        ephemeral: ephemeral,
                    });
                } else {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Failed to Update File")
                                .setDescription(json.message)
                                .addFields([
                                    {
                                        name: "Note:",
                                        value: `Your seller key might be invalid. Change your seller key with \`/add-application\` command.`,
                                    },
                                ])
                                .setColor(Colors.Red)
                                .setFooter({ text: "KeyAuth Discord Bot" })
                                .setTimestamp(),
                        ],
                        ephemeral: ephemeral,
                    });
                }
            });
    },
};