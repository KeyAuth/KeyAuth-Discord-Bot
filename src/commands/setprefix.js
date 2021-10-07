const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "setprefix",
    description: "Set a server's prefix",

    async run (client, message) {

        let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Specify bot prefix for commands:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let prefix = message.content;

db.set(`prefix_${message.guild.id}`, prefix)
    message.channel.send(new Discord.MessageEmbed().setTitle('Bot Prefix Successfully Set!').addField('Set By:', message.author).setColor("GREEN").setTimestamp());


        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })

    
    }
}