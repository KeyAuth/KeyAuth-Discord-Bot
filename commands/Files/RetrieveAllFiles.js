const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require("../../utils/database");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retrieve-all-files")
        .setDescription("Retrieve all existing files")
        .setDescriptionLocalizations({
            "en-US": "Retrieve all existing files",
            fi: "Hae kaikki olemassa olevat tiedostot",
            fr: "Récupérer tous les fichiers existants",
            de: "Alle vorhandenen Dateien abrufen",
            it: "Recupera tutti i file esistenti",
            nl: "Alle bestaande bestanden ophalen",
            ru: "Получить все существующие файлы",
            pl: "Pobierz wszystkie istniejące pliki",
            tr: "Tüm mevcut dosyaları al",
            cs: "Načíst všechny existující soubory",
            ja: "すべての既存のファイルを取得する",
            ko: "모든 기존 파일 검색",
        }),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

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

        console.log(`Fetching all files with sellerkey: ${sellerkey}`);
        fetch(
            `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallfiles`
        )
            .then((res) => res.json())
            .then((json) => {
                console.log('API Response:', JSON.stringify(json, null, 2));
                if (json.success) {
                    const fileList = json.files.map(file => {
                        const fileName = new URL(file.url).pathname.split('/').pop();
                        return `ID: \`${file.id}\`, Name: \`${fileName || 'None'}\`, [URL](${file.url})`;
                    }).join('\n');

                    const embed = new EmbedBuilder()
                        .setTitle("All Files Retrieved Successfully")
                        .setDescription(fileList || "No files found.")
                        .setColor(Colors.Green)
                        .setTimestamp();

                    // If the file list is too long, split it into multiple fields
                    if (fileList.length > 1024) {
                        const chunks = fileList.match(/.{1,1024}/g);
                        chunks.forEach((chunk, index) => {
                            embed.addFields({ name: `Files (Part ${index + 1})`, value: chunk });
                        });
                    } else {
                        embed.addFields({ name: "Files", value: fileList || "No files found." });
                    }

                    console.log('Sending response to user');
                    interaction.editReply({
                        embeds: [embed],
                        ephemeral: ephemeral,
                    });
                } else {
                    console.log('API request failed:', json.message);
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Failed to Retrieve Files")
                                .setDescription(json.message || "An error occurred while retrieving the files.")
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