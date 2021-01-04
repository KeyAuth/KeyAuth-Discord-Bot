const db = require('quick.db');

module.exports = {
    name: "setprefix",
    description: "Set a server's prefix",

    async run (client, message, args) {

    if(!args[0]) return message.channel.send('Please Provide A Valid Prefix');

    if(args[1]) return message.channel.send('The Prefix Can\'t Have Two Spaces');

    db.set(`prefix_${message.guild.id}`, args[0])

    message.channel.send(`Succesffully Set New Prefix To \`${args[0]}\``)
    
    }
}