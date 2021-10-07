const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "info",
    description: "Info On key",

    async run (client, message) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());


        let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Specify key:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let key = message.content;

    fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=info&key=${key}`)
    .then(res => res.json())
    .then(json => {
    message.channel.send(new Discord.MessageEmbed().setTitle(`Key Information for ${key}`).addField('Expiry:', `${json['expiry']}`).addField('Last Login:', `${json['lastlogin']}`).addField('HWID:', `${json['hwid']}`).addField('Status:', `${json['status']}`).addField('Level:', `${json['level']}`).addField('Created By:', `${json['createdby']}`).addField('Created On:', `${json['creationdate']}`).addField('IP Address:', `${json['ip']}`).setColor("BLUE").setTimestamp());
    })

        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })



    }
}
