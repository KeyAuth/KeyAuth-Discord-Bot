const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "addvar",
    description: "Add Variable",

async run (client, message) {


    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

let filter = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Variable Name?').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let varname = message.content;

          let filteer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Variable Value?').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let varvalue = message.content;
          
		                fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addvar&name=${varname}&data=${varvalue}&format=text`)
    .then(res => res.text())
    .then(text => {
    message.channel.send(new Discord.MessageEmbed().setTitle('Variable Successfully Added!').addField('Var Add By:', message.author).setColor("GREEN").setTimestamp());
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
