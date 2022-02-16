const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "delunused",
    description: "Delete Unused Licenses",

    async run (client, message) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

    fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=delunused`)
    .then(res => res.json())
    .then(json => {
    message.channel.send(new Discord.MessageEmbed().setTitle('Deleted Unused Licenses').setColor("GREEN").setTimestamp());
    })

    }
}
