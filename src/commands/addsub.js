const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "addsub",
    description: "Add Subscription",

async run (client, message) {


    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

let filter = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Subscription Name?').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let subname = message.content;

          let filteer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Subscription Level?').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let sublevel = message.content;
          
		                fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addsub&name=${subname}&level=${sublevel}&format=text`)
    .then(res => res.text())
    .then(text => {
    message.channel.send(new Discord.MessageEmbed().setTitle('Subscription Successfully Added!').addField('Sub Add By:', message.author).setColor("GREEN").setTimestamp());
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
