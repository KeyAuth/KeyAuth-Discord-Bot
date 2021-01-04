const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "download",
    description: "Download all keys",

    async run (client, message, args) {

    let days = parseInt(args[0])
    let amount = parseInt(args[1])
    let level = parseInt(args[2])
    let length = parseInt(args[3])
    let format = parseInt(args[4])

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

    message.channel.send(`Go to the following link to download all your keys:\n https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=download`);
    }
}