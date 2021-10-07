const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    name: "setseller",
    description: "Sets The authkey",

    async run (client, message) {

        let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Specify application seller key:').addField("Where do I find seller key?", "In [Seller Settings](https://keyauth.com/dashboard/sellersettings/)").setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let sellerkey = message.content;

                  fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=setseller&format=text`)
    .then(res => res.text())
    .then(text => {
    if(text == "Seller Key Successfully Found")
    {
    message.delete()
    db.fetch(`token_${message.guild.id}`)
    db.set(`token_${message.guild.id}`, sellerkey)
    message.channel.send(new Discord.MessageEmbed().setTitle('Seller Key Successfully Set!').addField('Set By:', message.author).setColor("GREEN").setTimestamp());
    }
    else
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('Seller Key Not Found!').addField('Failed Attempt By:', message.author).addField("Where do I find seller key?", "In [Seller Settings](https://keyauth.com/dashboard/sellersettings/)").setColor("RED").setTimestamp());
    }
    })

        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })

    }

}
