const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetch")
        .setDescription("Fetch * All Things")
        .addSubcommand((subcommand) =>
            subcommand
                .setName('licenses')
                .setDescription('Fetch All Licenses')
                .addStringOption((option) =>
                    option
                        .setName("format")
                        .setDescription("Specify format of licenses")
                        .addChoices(
                            { name: "Text", value: "text" },
                            { name: "JSON", value: "json" }
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('users')
                .setDescription('Fetch All Users')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('user-vars')
                .setDescription('Fetch All User\'s Variables')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('usernames')
                .setDescription('Fetch All Usernames')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('subs')
                .setDescription('Fetch All Subs')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('chats')
                .setDescription('Fetch All Chats')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('sessions')
                .setDescription('Fetch All Sessions')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('files')
                .setDescription('Fetch All Files')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('vars')
                .setDescription('Fetch All Vars')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('blacklists')
                .setDescription('Fetch All Blacklists')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('webhooks')
                .setDescription("Fetch All Webhooks")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('buttons')
                .setDescription('Fetch All Buttons')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('mutes')
                .setDescription('Fetch All Mutes')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('channels')
                .setDescription('Fetch All Channels')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('appdetails')
                .setDescription('Fetch Application Details')
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('logs')
                .setDescription('Fetch All Logs')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('team')
                .setDescription('Fetch All Resellers and Managers')
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let subcommand = interaction.options.getSubcommand();

        if (subcommand === "licenses") {
            let format = interaction.options.getString("format") || "text";
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching Licenses...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            var KeyList = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallkeys&format=${format}`;
            interaction.editReply({
                embeds: [new EmbedBuilder().setAuthor({ name: "keyauth Application Keys" }).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                files: [{
                    attachment: KeyList,
                    name: 'keys.' + (format === "text" ? "txt" : "json")
                }],
                ephemeral: ephemeral
            });

        } else if (subcommand === "users") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching Users...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallusers`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var users = "";
                        for (var i = 0; i < json.users.length; i++) {
                            users += json.users[i].username + "\n";
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("keyauth Application Users").setDescription(`**${users}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "user-vars") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching User Vars...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchalluservars`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        var vars = "";
                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application User Vars").setDescription(`**${vars}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });
                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "usernames") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching usernames...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallusernames`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        var usernames = "";
                        for (var i = 0; i < json.usernames.length; i++) {
                            usernames += json.usernames[i].username + "\n";
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application User Vars").setDescription(`**${usernames}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "subs") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching subscriptions...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallsubs`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var subs = "";
                        for (var i = 0; i < json.subs.length; i++) {
                            subs += json.subs[i].username + "\n";
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Subscriptions").setDescription(`**${subs}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })

        } else if (subcommand === "chats") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching chats...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallchats`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var chats = "";
                        for (var i = 0; i < json.chats.length; i++) {
                            chats += `Name: ${json.chats[i].name} - Delay: ${json.chats[i].delay}\n`;
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Chat Channels").setDescription(`**${chats}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })

        } else if (subcommand === "sessions") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching sessions...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallsessions`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var sessions = "";
                        for (var i = 0; i < json.sessions.length; i++) {
                            sessions += `ID: ${json.sessions[i].id} - Validated: ${json.sessions[i].validated ? true : false}` + "\n";
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Sessions").setDescription(`**${sessions}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })


        } else if (subcommand === "files") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching files...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallfiles`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var files = "";
                        for (var i = 0; i < json.files.length; i++) {
                            files += `ID: ${json.files[i].id} - Download: [Here](${json.files[i].url})` + "\n";
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Files").setDescription(`**${files}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })


        } else if (subcommand === "vars") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching variables...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallvars`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var vars = "";
                        for (var i = 0; i < json.vars.length; i++) {
                            vars += `ID: ${json.vars[i].varid} - Data: ${json.vars[i].msg}` + "\n";
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Variables").setDescription(`**${vars}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })

        } else if (subcommand === "blacklists") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching blacklists...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallblacks`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var blacklists = "";
                        for (var i = 0; i < json.blacklists.length; i++) {

                            let btemp = "";
                            if (json.blacklists[i].ip !== null)
                                btemp = `\`\`\`${json.blacklists[i].ip}\`\`\``;
                            else
                                btemp = `\`\`\`${json.blacklists[i].hwid}\`\`\``;

                            blacklists += `**ID: ${i} - Type: ${json.blacklists[i].type}** ${btemp}` + "\n";
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Blacklists").setDescription(`${blacklists}`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })

        } else if (subcommand === "webhooks") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching webhooks...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallwebhooks`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        var webhooks = "";
                        for (var i = 0; i < json.webhooks.length; i++) {
                            let authed = (json.webhooks[i].authed == "1") ? "True" : "False";
                            webhooks += `Web ID: \`${json.webhooks[i].webid}\` - Base link: \`${json.webhooks[i].short_baselink}\` - Useragent: \`${json.webhooks[i].useragent}\` - Authed: \`${authed}\`\n`
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Webhooks").setDescription(`**${webhooks}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });
                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "buttons") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching buttons...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallbuttons`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var buttons = "";
                        for (var i = 0; i < json.buttons.length; i++) {
                            buttons += `Text: ${json.buttons[i].text} - Value: ${json.buttons[i].value}`
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Buttons").setDescription(`**${buttons}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "mutes") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching mutes...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallmutes`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var mutes = "";
                        for (var i = 0; i < json.mutes.length; i++) {
                            mutes += `Username: ${json.mutes[i].user} - Time: ${json.mutes[i].time}\n`;
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Mutes").setDescription(`**${mutes}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "channels") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching channels...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallchats`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {

                        var channels = "";
                        for (var i = 0; i < json.channels.length; i++) {
                            channels += `Name: ${json.channels[i].name} - Delay: ${json.channels[i].delay}\n`;
                        }

                        interaction.editReply({
                            embeds: [new EmbedBuilder().setTitle("KeyAuth Application Channels").setDescription(`**${channels}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "appdetails") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching application details...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=appdetails`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("keyauth Application Details")
                                    .setFooter({ text: "KeyAuth Discord Bot" })
                                    .addFields(
                                        { name: 'Application Name', value: json.appdetails.name },
                                        { name: 'Owner ID', value: json.appdetails.ownerid },
                                        { name: 'Secret', value: json.appdetails.secret },
                                        { name: 'App Version', value: json.appdetails.version }
                                    )
                                    .setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "logs") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching logs...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchalllogs`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("KeyAuth Application Logs")
                                    .setFooter({ text: "KeyAuth Discord Bot" })
                                    .addFields(
                                        { name: 'Logs', value: json.logs }
                                    )
                                    .setColor(Colors.Green).setTimestamp()],
                            ephemeral: ephemeral
                        });

                    } else {
                        interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                    }
                })
        } else if (subcommand === "team") {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle("Fetching team members...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchteam`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        // Create fields for resellers
                        const resellerFields = json.resellers.map(reseller => {
                            return {
                                name: `Reseller: ${reseller.username}`,
                                value: `Balance: ${reseller.balance}\nKey Levels: ${reseller.key_levels}`
                            };
                        });

                        // Create fields for managers
                        const managerFields = json.managers.map(manager => {
                            return {
                                name: `Manager: ${manager.username}`,
                                value: `Permissions: ${JSON.stringify(manager.permissions)}`
                            };
                        });

                        // Combine all fields
                        const allFields = [...resellerFields, ...managerFields];

                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("KeyAuth Application Team Members")
                                    .setFooter({ text: "KeyAuth Discord Bot" })
                                    .addFields(allFields.length > 0 ? allFields : [{ name: 'No Team Members', value: 'No resellers or managers found.' }])
                                    .setColor(Colors.Green)
                                    .setTimestamp()
                            ],
                            ephemeral: ephemeral
                        });
                    } else {
                        interaction.editReply({ 
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(json.message)
                                    .addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }])
                                    .setColor(Colors.Red)
                                    .setFooter({ text: "KeyAuth Discord Bot" })
                                    .setTimestamp()
                            ], 
                            ephemeral: ephemeral 
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching team data:', error);
                    interaction.editReply({ 
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Error fetching team data')
                                .setDescription('An error occurred while fetching team data.')
                                .setColor(Colors.Red)
                                .setFooter({ text: "KeyAuth Discord Bot" })
                                .setTimestamp()
                        ], 
                        ephemeral: ephemeral 
                    });
                });
        } else {
            interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`Subcommand\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        }

    },
};  
