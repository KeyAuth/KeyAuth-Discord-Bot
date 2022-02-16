const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');


module.exports = {
    name: "resetuser",
    description: "Reset a user",

    async run (client, message) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

        let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Specify username:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
          message = message.first()
          let un = message.content;

                  fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetuser&user=${un}&format=text`)
    .then(res => res.text())
    .then(text => {
    if(text == "Successfully Reset User")
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('User Successfully Reset!').addField('Deleted By:', message.author).addField('User Reset:', `\`${un}\``).setColor("GREEN").setTimestamp());
    }
    else
    {
    message.channel.send(new Discord.MessageEmbed().setTitle('User Reset Failed!').addField('Failed Attempt By:', message.author).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`).setColor("RED").setTimestamp());
    }
    })

        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })

        
    }
}
