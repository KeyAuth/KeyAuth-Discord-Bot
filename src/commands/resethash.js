const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "resethash",
    description: "Reset app hash",

    async run (client, message, args) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

    fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=resethash`)
    .then(res => res.text())
    .then(text => {
    if(text == "reset")
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('Hash Successfully Reset!').addField('Hash Reset By:', message.author).addField('Reminder:', `You need to reset hash each time you compile loader.`).setColor("GREEN").setTimestamp());
    }
    else
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('Hash Reset Failed!').addField('Failed Attempt By:', message.author).addField('Note:', `Your SellerKey is most likely invalid. Change your seller key with \`setseller\` command.`).setColor("RED").setTimestamp());
    }
    })

    }
}