const db = require('quick.db')
const Discord = require('discord.js');

module.exports = {
    name: "setseller",
    description: "Sets The authkey",

    async run (client, message, args) {

    if(!args[0]) return message.channel.send('Please Provide A Valid AuthKey');

    if(args[1]) return message.channel.send('Invalid Seller Key');

    await db.fetch(`token_${message.guild.id}`)
    await db.set(`token_${message.guild.id}`, args[0])

    message.channel.send(`Successfully Set SellerKey. Do command again if you want to change application.`)
    }

}