const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "deluser",
    description: "Delete user",

    async run (client, message) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());


        let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Enter Username:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let un = message.content;

    fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=deluser&username=${un}`)
    .then(res => res.text())
    .then(text => {
    message.channel.send(new Discord.MessageEmbed().setTitle(`Successfully Deleted User`).setColor("GREEN").setTimestamp());
    })

        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })



    }
}
