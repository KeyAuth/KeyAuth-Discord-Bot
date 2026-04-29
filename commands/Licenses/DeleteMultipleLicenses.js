const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

function buildDeletedKeyFields(keys) {
    const keyList = keys
        .split(",")
        .map((key) => key.trim())
        .filter(Boolean);

    const maxFieldLength = 1024;
    const maxFields = 25;
    const fields = [];
    let currentValue = "";

    for (const key of keyList) {
        const line = `• \`${key}\``;
        const nextValue = currentValue ? `${currentValue}\n${line}` : line;

        if (nextValue.length > maxFieldLength) {
            fields.push({
                name: fields.length === 0 ? "Keys Deleted:" : "Keys Deleted (cont.):",
                value: currentValue,
            });
            currentValue = line;
        } else {
            currentValue = nextValue;
        }
    }

    if (currentValue) {
        fields.push({
            name: fields.length === 0 ? "Keys Deleted:" : "Keys Deleted (cont.):",
            value: currentValue,
        });
    }

    if (fields.length <= maxFields) {
        return fields;
    }

    const visibleFields = fields.slice(0, maxFields - 1);
    const shownKeys = visibleFields
        .reduce((count, field) => count + field.value.split("\n").length, 0);

    visibleFields.push({
        name: "Additional Keys:",
        value: `${keyList.length - shownKeys} more key(s) were deleted.`,
    });

    return visibleFields;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-multiple-licenses")
        .setDescription("Delete multiple licenses")
        .addStringOption((option) =>
            option
                .setName("licenses")
                .setDescription("Specify key you would like deleted (seperate with comma and space)")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("usertoo")
                .setDescription("Delete from user too?")
                .setRequired(false)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let keys = interaction.options.getString("licenses")
        let userToo = interaction.options.getBoolean("usertoo") ? 1 : 0;

        try {
            const res = await fetch(`https://keyauth.win/api/seller/?sellerkey=${encodeURIComponent(sellerkey)}&type=delmultiple&key=${encodeURIComponent(keys)}&userToo=${userToo}&format=json`)
            const json = await res.json()

            if (json.success) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(json.message)
                            .addFields(buildDeletedKeyFields(keys))
                            .setColor(Colors.Green)
                            .setTimestamp()
                    ],
                    ephemeral: ephemeral
                })
            }

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(json.message)
                        .addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }])
                        .setColor(Colors.Red)
                        .setTimestamp()
                ],
                ephemeral: ephemeral
            })
        } catch (error) {
            console.error("Failed to delete multiple licenses:", error)

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Failed to delete licenses.")
                        .setDescription("The request could not be completed. Check the bot logs for details.")
                        .setColor(Colors.Red)
                        .setTimestamp()
                ],
                ephemeral: ephemeral
            })
        }
    },
};
