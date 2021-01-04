const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');


module.exports = {
    name: "reset",
    description: "Reset a key",

    async run (client, message, args) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

    let key = args[0]

    if(!key) return message.channel.send('Please Provide A Valid Key To Reset');

    
    fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=reset&key=${key}`)
    .then(res => res.text())
    .then(text => {
    if(text == "reset")
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('Key Successfully Reset!').addField('Reset By:', message.author).addField('Key Reset:', `\`${args[0]}\``).setColor("GREEN").setTimestamp());
    }
    else
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('Key Reset Failed!').addField('Failed Attempt By:', message.author).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`).setColor("RED").setTimestamp());
    }
    })
    }
}