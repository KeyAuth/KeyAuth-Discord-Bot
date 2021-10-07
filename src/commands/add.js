const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "add",
    description: "Add key",

async run (client, message) {


    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

let filter = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('How many days?').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let days = message.content;
          if(isNaN(days))
          {
          return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, non-numerical answer provided.').setColor("RED"));
          }

          let filteer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('What level?').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let level = message.content;

          if(isNaN(level))
          {
          return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, non-numerical answer provided.').setColor("RED"));
          }
          

                    let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('What amount?').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let amount = message.content;
          
          if(isNaN(amount))
          {
          return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, non-numerical answer provided.').setColor("RED"));
          }

              fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=add&expiry=${days}&level=${level}&amount=${amount}&format=text`)
    .then(res => res.text())
    .then(text => {
    message.channel.send(new Discord.MessageEmbed().setTitle('Key Successfully Added!').addField('Key Add By:', message.author).addField('Key Added:', `${text}`).setColor("GREEN").setTimestamp());
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
