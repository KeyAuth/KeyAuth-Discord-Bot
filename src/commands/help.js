const Discord = require('discord.js');
const db = require('quick.db');
const { default_prefix } = require('./../config.json')

module.exports = {
    name: "help",
    description: "The help command, what do you expect?",

    async run (client, message, args) {

        let prefix = await db.get(`prefix_${message.guild.id}`);
        if(prefix === null) prefix = default_prefix;

        const embed = new Discord.MessageEmbed()
        .setTitle('KeyAuth Discord Bot | Help\n\n')
        .setThumbnail(client.user.displayAvatarURL())
	.addField('`setseller`', `Sets Seller Key. Run again to change applications \nArgs: **${prefix}setseller [sellerkey]**`)
        .addField('`setprefix`', `Change the bot prefix. \nArgs: **${prefix}setprefix [prefix]**`)
        .addField("Current Bot Prefix Is:", `\`${prefix}\``)
        .setColor("#00FFFF")
        .addField('`add`', `Add key(s). \nArgs: **${prefix}add [expiry in days]**`)
        .addField('`del`', `Delete key. \nArgs: **${prefix}del [key]**`)
        .addField('`info`', `Key Information. \nArgs: **${prefix}info [key]**`)
        .addField('`reset`', `Reset key. \nArgs: **${prefix}reset [key]**`)
	.addField('`resethash`', `Reset App Hash. \nArgs: **${prefix}resethash**`)
	.addField('`download`', `Download All Keys. \nArgs: **${prefix}download**`)
        .setFooter('KeyAuth Discord Bot', client.user.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed)
        
    }
}
