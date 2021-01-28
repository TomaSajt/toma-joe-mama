const Discord = require('discord.js');
const config = require('./config.json');
const kareszCommand = require('./commands/karesz.js');
const joeMamaCommand = require('./commands/joe mama.js');
const whosJoeCommand = require('./commands/whos joe.js');
var crashing = false;
var pause = false;

var client = new Discord.Client();
client.once('ready', () => {
    console.log('Restarted');
});

client.on('message', async message => {
    var text = message.content.toLowerCase()
    if (message.author.bot || crashing) return;
    if (text == `${config.prefix}unpause`) {
        pause = false;
        message.channel.send("Unpaused instance this instance of the bot")
    }
    if (pause) return;
    if (text == `${config.prefix}pause`) {
        pause = true;
        message.channel.send("Paused instance this instance of the bot")
    }
    kareszCommand(message)
    if (text.includes("pog")) {
        message.react("<:RuviPog:777804089290784808>")
    }
    joeMamaCommand(message);
    whosJoeCommand(message);
    if (text == `${config.prefix}help`) {
        message.channel.send("There is no helping you...")
    }
    if (text.startsWith(`${config.prefix}timer`)) {
        var args = message.content.substring(`${config.prefix}timer`.length).trim().split().filter(str => str != "");
        var num = parseInt(args[0])
        if (!isNaN(num)) {
            if (num >= 0) {
                if (num <= 300) {
                    try {
                        var mes = await message.channel.send(num)
                        for (var i = num - 1; i >= 0; i--) {
                            await delay(1000)
                            if (i%5==0 || i<5) {
                                mes.edit(i);
                            }
                        }
                    } catch (e) {
                        message.channel.send("an exeption happened, idk what tho")
                    }
                } else {
                    message.channel.send("The longest wait time is 5 min (300 sec)");
                }
            } else {
                message.channel.send("Your number is lower than your IQ, which is invalid");
            }
        } else {
            message.channel.send("This number is invalid")
        }
    }
    if (message.content.toLowerCase() == `${config.prefix}crash`) {
        if (message.member.id == config.members.toma) {
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