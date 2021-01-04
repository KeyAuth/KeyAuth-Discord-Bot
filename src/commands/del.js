const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    name: "del",
    description: "Delete a key",

    async run (client, message, args) {

    let key = args[0]

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());


    if(!args[0]) return message.channel.send('Please Provide A Valid Key');

    fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=del&key=${key}`)
    .then(res => res.text())
    .then(text => {
    if(text == "deleted")
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('Key Successfully Deleted!').addField('Deleted By:', message.author).addField('Key Deleted:', `\`${args[0]}\``).setColor("GREEN").setTimestamp());
    }
    else
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('Key Delete Failed!').addField('Failed Attempt By:', message.author).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`).setColor("RED").setTimestamp());
    }
    })

    }
}