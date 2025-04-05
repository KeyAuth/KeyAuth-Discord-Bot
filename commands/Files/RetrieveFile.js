const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retrieve-file")
        .setDescription("Retrieve an existing file")
        .setDescriptionLocalizations({
            "en-US": "Retrieve an existing file",
            fi: "Hae olemassa oleva tiedosto",
            fr: "Récupérer un fichier existant",
            de: "Eine vorhandene Datei abrufen",
            it: "Recupera un file esistente",
            nl: "Een bestaand bestand ophalen",
            ru: "Получить существующий файл",
            pl: "Pobierz istniejący plik",
            tr: "Mevcut bir dosyayı al",
            cs: "Načíst existující soubor",
            ja: "既存のファイルを取得する",
            ko: "기존 파일 검색",
        })
        .addStringOption((option) =>
            option
                .setName("fileid")
                .setDescription("The ID of the file you want to retrieve")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = interaction.guild;

        let sellerkey = await db.get(`token_${idfrom}`);
        if (sellerkey === null)
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\`, then \`/set-application\` Commands First.`
                        )
                        .setColor(Colors.Red)
                        .setTimestamp(),
                ],
                ephemeral: ephemeral,
            });

        let fileid = interaction.options.getString("fileid");

        fetch(
            `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchfile&id=${fileid}`
        )
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("File Retrieved Successfully")
                                .addFields([
                                    { name: "File ID", value: json.file.id },
                                    { name: "File URL", value: json.file.url },
                                    { name: "File Name", value: json.file.name },
                                    { name: "File Size", value: json.file.size },
                                    { name: "Authentication Required", value: json.file.authed ? "Yes" : "No" },
                                ])
                                .setColor(Colors.Green)
                                .setTimestamp(),
                        ],
                        ephemeral: ephemeral,
                    });
                } else {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Failed to Retrieve File")
                                .setDescription(json.message || "An error occurred while retrieving the file.")
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
            })
            .catch((error) => {
                console.error('Error:', error);
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription("An error occurred while processing your request.")
                            .setColor(Colors.Red)
                            .setTimestamp(),
                    ],
                    ephemeral: ephemeral,
                });
            });
    },
};