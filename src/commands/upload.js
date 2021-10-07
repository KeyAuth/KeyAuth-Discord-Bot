const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');


module.exports = {
    name: "upload",
    description: "Upload a file",

    async run (client, message) {

    let sellerkey = await db.get(`token_${message.guild.id}`)
    if(sellerkey === null) return message.channel.send(new Discord.MessageEmbed().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor("RED").setTimestamp());

        let filteeer = m => m.author.id === message.author.id
    message.channel.send(new Discord.MessageEmbed().setTitle('Send file you want to upload:').setColor("YELLOW")).then(() => {
      message.channel.awaitMessages(filteeer, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
		  message.first().delete();
          message = message.first()
          let url = message.attachments.array()[0].url;

                  fetch(`https://keyauth.com/api/seller/?sellerkey=${sellerkey}&type=upload&url=${url}&format=text`)
    .then(res => res.text())
    .then(text => {
    if(text.includes('Successfully'))
    {
    message.channel.send(new Discord.MessageEmbed().setTitle(text).addField('Uploaded By:', message.author).setColor("GREEN").setTimestamp());
    }
    else
    {
    message.channel.send(new Discord.MessageEmbed().setTitle(text).addField('Failed Attempt By:', message.author).addField('Note:', `Your seller key is most likely invalid. Change your seller key with \`setseller\` command.`).setColor("RED").setTimestamp());
    }
    })

        })
        .catch(collected => {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Failure, didn\'t respond in time.').setColor("RED"));
        });
    })

        
    }
}
