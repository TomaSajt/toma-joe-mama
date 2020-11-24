const Discord = require('discord.js');
const io = require('console-read-write');
const config = require('./config.json');
var client;
var canRestart = false;

client = new Discord.Client();
client.once('ready', () => {
    canRestart = true;
    console.log('Restarted');
});
client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().includes("karesz")) {
        message.react("<:karesz:776413600117030913>")
    }
    if (message.content.toLowerCase().includes("pog")) {
        message.react("<:RuviPog:777804089290784808>")
    }
    if (message.content.toLowerCase().includes("joe mama")) {
        message.channel.send(`> You are almost as funny as me ${message.author}`, { files: ["https://i.imgur.com/NEZEOhS.gif"] })
    }
    if (message.content.toLowerCase().includes("joe") && (message.content.toLowerCase().includes("who's") || message.content.toLowerCase().includes("who is") || message.content.toLowerCase().includes("whos") || message.content.toLowerCase().includes("who s"))) {
        message.channel.send("joe mama")
    }
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(' ').filter(str => str != "");
    switch (args[0]) {
        case "crash":
            if (message.member.id == "436579592447197225") {
                message.channel.send("crashing in 3")
                setTimeout(() => { }, 1000);
                message.channel.send("crashing in 2")
                setTimeout(() => { }, 1000);
                message.channel.send("crashing in 1")
                setTimeout(() => { }, 1000);
                message.channel.send("crashed")
                crash;
                message.channel.send("this should not come up")
            } else {
                message.channel.send("only TomaSajt can do that")
            }
            break;
    }
});
client.login(config.token);
/*setInterval(input, 1000)

async function input() {
    if (await io.read() === "crash") {
        crash;
    }
}*/