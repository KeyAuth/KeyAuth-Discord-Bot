const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "activate",
    description: "Activate License Key",

async run (client, message) {


    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

let filter = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Enter username to register:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let un = message.content;

          let filteer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Enter Valid License:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let key = message.content;

                    let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Enter Password:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let pw = message.content;

              fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=activate&user=${un}&key=${key}&pass=${pw}&format=text`)
    .then(res => res.text())
    .then(text => {
    message.channel.send(new Discord.MessageEmbed().setTitle('License Successfully Activated!').addField('Activated By:', message.author).addField('License Activated:', `${key}`).setColor("GREEN").setTimestamp());
    })

        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })




        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })


        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })




    }
}
