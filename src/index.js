const Discord = require('discord.js');

const client = new Discord.Client();

const { token, default_prefix } = require('./config.json');

const config = require('./config.json');
client.config = config;

const db = require('quick.db')

const { readdirSync } = require('fs');

const { join } = require('path');

client.commands= new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);

client.on('ready', () => {
    console.clear();
    console.log("Bot Online");
    console.log("Bot Default Prefix is:", config.default_prefix)
    console.log("Logged in as:", client.user.tag)
    client.user.setActivity(".help | keyauth.com | top c++ auth"); 
});

client.on("message", async message => {
let prefix = await db.get(`prefix_${message.guild.id}`);
if(prefix === null) prefix = default_prefix;

    if (message.author.bot) return false;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

    if (message.mentions.has(client.user.id)) {
        const embed = new Discord.MessageEmbed()
        .setTitle('KeyAuth Discord Bot | Help\n\n')
        .setThumbnail(client.user.displayAvatarURL())
	.addField('`setseller`', `Sets Seller Key. Run again to change applications \nArgs: **${prefix}setseller [sellerkey]**`)
        .addField('`setprefix`', `Change the bot prefix. \nArgs: **${prefix}setprefix [prefix]**`)
        .addField("Current Bot Prefix Is:", `\`${prefix}\``)
        .setColor("#00FFFF")
        .addField('`add`', `Add key(s). \nArgs: **${prefix}add [expiry in days] [amount] [level]**`)
        .addField('`del`', `Delete key. \nArgs: **${prefix}del [key]**`)
        .addField('`reset`', `Reset key. \nArgs: **${prefix}reset [key]**`)
	.addField('`resethash`', `Reset App Hash. \nArgs: **${prefix}resethash**`)
	.addField('`download`', `Download All Keys. \nArgs: **${prefix}download**`)
        .setFooter('KeyAuth Discord Bot', client.user.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed)
    };


    if(message.content.startsWith(prefix)) {

	if (message.guild.id == 780636139659722772) {
      	message.channel.send('For security reasons add bot to your server and do commands in private ==> https://discord.com/api/oauth2/authorize?client_id=784252793149325312&permissions=8&scope=bot');
    	}

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You Need The \`ADMINISTRATOR\` Permission To Use This Command. Add KeyAuth bot to your server ==> https://discord.com/api/oauth2/authorize?client_id=784252793149325312&permissions=8&scope=bot');
        try {
            message.delete();
            client.commands.get(command).run(client, message, args);
        } catch (error){
            console.error(error);
        }
    }

})


client.login(token);

    