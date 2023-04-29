const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetch")
        .setDescription("Fetch * All Things")
        .addSubcommand((subcommand) =>
            subcommand
                .setName('licenses')
                .setDescription('Fetch All Licenses')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('users')
                .setDescription('Fetch All Users')
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
                .setName('buttons')
                .setDescription('Fetch All Buttons')
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
        if (sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let subcommand = interaction.options.getSubcommand();

        if (subcommand === "licenses") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Licenses...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            var KeyList = `https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallkeys&format=text`;
            interaction.editReply({
                embeds: [new Discord.EmbedBuilder().setAuthor({ name: "KeyAuth Application Keys" }).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                files: [{
                    attachment: KeyList,
                    name: 'keys.txt'
                }],
                ephemeral: ephemeral
            });

        } else if (subcommand === "users") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Users...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallusers`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    var users = "";
                    for (var i = 0; i < json.users.length; i++) {
                        users += json.users[i].username + "\n";
                    }
                    
                    interaction.editReply({
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Users").setDescription(`**${users}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })
        } else if (subcommand === "subs") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Subs...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallsubs`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    var subs = "";
                    for (var i = 0; i < json.subs.length; i++) {
                        subs += json.subs[i].username + "\n";
                    }
                    
                    interaction.editReply({
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Subscriptions").setDescription(`**${subs}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })

        } else if (subcommand === "chats") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Chats...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallchats`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    var chats = "";
                    for (var i = 0; i < json.chats.length; i++) {
                        chats += `Name: ${json.chats[i].name} - Delay: ${json.chats[i].delay}\n`;
                    }
                    
                    interaction.editReply({
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Chat Channels").setDescription(`**${chats}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })

        } else if (subcommand === "sessions") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Sessions...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallsessions`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    var sessions = "";
                    for (var i = 0; i < json.sessions.length; i++) {
                        sessions += `ID: ${json.sessions[i].id} - Validated: ${json.sessions[i].validated ? true : false}` + "\n";
                    }
                    
                    interaction.editReply({
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Sessions").setDescription(`**${sessions}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })


        } else if (subcommand === "files") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Files...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallfiles`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    var files = "";
                    for (var i = 0; i < json.files.length; i++) {
                        files += `ID: ${json.files[i].id} - Download: [Here](${json.files[i].url})` + "\n";
                    }
                    
                    interaction.editReply({
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Files").setDescription(`**${files}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })


        } else if (subcommand === "vars") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Vars...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallvars`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    var vars = "";
                    for (var i = 0; i < json.vars.length; i++) {
                        vars += `ID: ${json.vars[i].varid} - Data: ${json.vars[i].msg}` + "\n";
                    }
                    
                    interaction.editReply({
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Variables").setDescription(`**${vars}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })

        } else if (subcommand === "blacklists") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Blacklists...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })

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
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Blacklists").setDescription(`${blacklists}`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })

        } else if (subcommand === "buttons") {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle("Fetching Buttons...").setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
            
            fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=fetchallbuttons`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {

                    var buttons = "";
                    for (var i = 0; i < json.buttons.length; i++) {
                        buttons += `Text: ${json.buttons[i].text} - Value: ${json.buttons[i].value}`
                    }
                    
                    interaction.editReply({
                        embeds: [new Discord.EmbedBuilder().setTitle("KeyAuth Application Buttons").setDescription(`**${buttons}**`).setFooter({ text: "KeyAuth Discord Bot" }).setColor(Colors.Green).setTimestamp()],
                        ephemeral: ephemeral
                    });

                } else {
                    interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
                }
            })

        } else {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`Subcommand\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        }

    },
};  