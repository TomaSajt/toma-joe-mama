const Discord = require('discord.js');
const config = require('./config.json');
const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});
var crashing = false;

var client = new Discord.Client();
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
                if (!crashing) {
                    crashing = true;
                    message.channel.send("crashing in 3")
                    await delay(1000);
                    message.channel.send("crashing in 2")
                    await delay(1000);
                    message.channel.send("crashing in 1")
                    await delay(1000);
                    message.channel.send("crashed")
                    crash;
                }



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