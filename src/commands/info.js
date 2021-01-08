const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "info",
    description: "Info On key",

    async run (client, message, args) {

    let key = args[0]

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

    if(!args[0]) return message.channel.send('Please Provide A Valid Expiry');

    fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=info&key=${key}`)
    .then(res => res.text())
    .then(text => {
    message.channel.send(new Discord.MessageEmbed().setTitle(`Key Information for ${key}`).addField('Expiry:', `${text}`).setColor("YELLOW").setTimestamp());
    })

    }
}