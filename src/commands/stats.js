const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "stats",
    description: "Application Statistics",

    async run (client, message) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

    fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=stats`)
    .then(res => res.json())
    .then(json => {
    message.channel.send(new Discord.MessageEmbed().setTitle('Application Statistics').addField('Unused Keys:', `${json['unused']}`).addField('Used Keys:', `${json['used']}`).addField('Paused Keys:', `${json['paused']}`).addField('Banned Keys:', `${json['banned']}`).addField('Total Keys:', `${json['totalkeys']}`).addField('Webhooks:', `${json['webhooks']}`).addField('Files:', `${json['files']}`).addField('Vars:', `${json['vars']}`).addField('Reseller Accounts:', `${json['resellers']}`).addField('Manager Accounts:', `${json['managers']}`).addField('Total Accounts:', `${json['totalaccs']}`).setColor("BLUE").setTimestamp());
    })

    }
}
