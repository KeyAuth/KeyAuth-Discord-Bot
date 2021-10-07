const Discord = require('discord.js');
const db = require('quick.db');
const { default_prefix } = require('./../config.json')

module.exports = {
    name: "help",
    description: "The help command, what do you expect?",

    async run (client, message) {

        let prefix = await db.get(`prefix_${message.guild.id}`);
        if(prefix === null) prefix = default_prefix;

        const embed = new Discord.MessageEmbed()
        .setTitle('Help\n\n')
        .setThumbnail(client.user.displayAvatarURL())
	.addField('`setseller`', `Sets Seller Key. Run again to change applications \nArgs: **${prefix}setseller**`)
        .addField('`setprefix`', `Change the bot prefix. \nArgs: **${prefix}setprefix**`)
        .addField("Current Bot Prefix Is:", `\`${prefix}\``)
        .setColor("#00FFFF")
        .addField('`activate`', `Activate License Keys. \nArgs: **${prefix}activate**`, true)
        .addField('`addhwid`', `Add HWIDs to user. \nArgs: **${prefix}addhwid**`, true)
        .addField('`addsub`', `Create subscription. \nArgs: **${prefix}addsub**`, true)
        .addField('`addvar`', `Create Variable. \nArgs: **${prefix}addvar**`, true)
        .addField('`delunused`', `Delete Unused Licenses. \nArgs: **${prefix}delunused**`, true)
        .addField('`deluser`', `Delete users. \nArgs: **${prefix}deluser**`, true)
        .addField('`editvar`', `Edit variable data. \nArgs: **${prefix}editvar**`, true)
        .addField('`extend`', `Extend user expiry. \nArgs: **${prefix}extend**`, true)
        .addField('`resetuser`', `Reset user HWID. \nArgs: **${prefix}resetuser**`, true)
        .addField('`verify`', `Verify License Key. \nArgs: **${prefix}verify**`, true)
        .addField('`add`', `Add key(s). \nArgs: **${prefix}add**`, true)
        .addField('`del`', `Delete key. \nArgs: **${prefix}del**`, true)
        .addField('`info`', `Key Information. \nArgs: **${prefix}info**`, true)
		.addField('`stats`', `Application Statistics. \nArgs: **${prefix}stats**`, true)
        .addField('`reset`', `Reset key. \nArgs: **${prefix}reset**`, true)
		.addField('`upload`', `Upload File. \nArgs: **${prefix}reset**`, true)
        .setFooter('KeyAuth Discord Bot', client.user.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed)
        
    }
}

