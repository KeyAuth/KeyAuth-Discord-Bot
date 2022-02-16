const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "verify",
    description: "Verify License",

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
	function checkResponseStatus(res) {
    if(res.ok){
        return message.channel.send(new Discord.MessageEmbed().setTitle('License Successfully Verified').setColor("GREEN"));
    } else {
        return message.channel.send(new Discord.MessageEmbed().setTitle('License Key Not Found').setColor("RED"));
    }
}

    fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=verify&key=${key}`)
    .then(checkResponseStatus);

        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })



    }
}
