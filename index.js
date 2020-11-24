const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Restarted');
});
client.on('message', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(' ').filter(str => str !="");
    switch (args[0]) {
        case "mama":
            //message.channel.send(`>You are so funny ${message.author}`)
            args.forEach(arg => message.channel.send(arg != "" ? arg : "üres"))
            break;
    }
});

client.login(config.token);