const Discord = require('discord.js');
const config = require('./config.json');
var crashing = false;

var client = new Discord.Client();
client.once('ready', () => {
    console.log('Restarted');
});

client.on('message', async message => {
    if (message.author.bot || crashing) return;
    if (message.content.toLowerCase() == `${config.prefix}unpause`) {
        pause = false;
        message.channel.send("Unpaused instance this instance of the bot")
    }
    if (pause) return;
    if (message.content.toLowerCase() == `${config.prefix}pause`) {
        pause = true;
        message.channel.send("Paused instance this instance of the bot")
    }
    if (message.content.toLowerCase().includes("karesz")) {
        message.react("<:karesz:776413600117030913>")
    }
    if (message.content.toLowerCase().includes("pog")) {
        message.react("<:RuviPog:777804089290784808>")
    }
    if (message.content.toLowerCase().includes("joe mama")) {
        message.channel.send(`> You are almost as funny as me ${message.author}`, { files: [randomPicture()] })
    }
    if (message.content.toLowerCase().includes("joe") && (message.content.toLowerCase().includes("who's") || message.content.toLowerCase().includes("who is") || message.content.toLowerCase().includes("whos") || message.content.toLowerCase().includes("who s"))) {
        message.channel.send("joe mama")
    }
    //const args = message.content.slice(config.prefix.length).trim().split(' ').filter(str => str != "");
    if (message.content.toLowerCase() == "joe!crash") {
        if (message.memsber.id == "436579592447197225") {
            crashing = true;
            message.channel.send("crashing in 3")
            await delay(1000)
            message.channel.send("crashing in 2")
            await delay(1000)
            message.channel.send("crashing in 1")
            await delay(1000)
            message.channel.send("crashed")
            await delay(100)
            crash;
        } else {
            message.channel.send("only TomaSajt can do that")
        }
    }
});
client.login(config.token);

async function delay(millis) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(0), millis)
    })
}
function randomPicture() {
    var pictures = []
    pictures.push("https://i.imgur.com/Fl4DpvB.jpg")
    pictures.push("https://i.imgur.com/NEZEOhS.gif")
    pictures.push("https://i.imgur.com/6iueg8x.png");
    return pictures[Math.floor(Math.random() * pictures.length)]
}