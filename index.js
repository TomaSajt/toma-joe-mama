const Discord = require('discord.js');
const config = require('./config.json');
const fetch = require('node-fetch');
var crashing = false;
var pause = false;

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
    if (message.content.toLowerCase() == `${config.prefix}help`) {
        message.channel.send("There is no helping you...")
    }
    if (message.content.toLowerCase() == `${config.prefix}leaderboard`) {
        fetch("https://adventofcode.com/2020/leaderboard/private/view/1022157.json", { headers: { cookie: `session=${config.aocSession}` } }).then(res => res.json())
            .then(data => {
                var members = [];
                for (var key in data.members) {
                    members.push(data.members[key])
                }
                members.sort((a, b) => b.local_score - a.local_score);
                var mess = "```";
                var longestName = 0;
                var longestScore = 0;
                members.forEach(mem => {
                    if (mem.name.length > longestName) longestName = mem.name.length
                    if (mem.local_score.toString().length > longestScore) longestScore = mem.local_score.toString().length
                })
                members.forEach(mem => {
                    mess += `${mem.name}:${" ".repeat(longestName - mem.name.length)}   Score: ${mem.local_score}${" ".repeat(longestScore - mem.local_score.toString().length)}   ${mem.stars}⭐ \n`
                })
                mess += "```";
                message.channel.send(mess)
            })

    }
    if (message.content.toLowerCase().startsWith(`${config.prefix}search`)) {
        var args = message.content.substring(`${config.prefix}search`.length).trim().split().filter(str => str != "");
        if (args.length > 1) {
            message.channel.send("Too many arguments")
        } else {
            var n = 1;
            if (args.length == 1) {
                n = parseInt(args[0])
            }
            if (n < 1) {
                message.channel.send("Please give a positive number")
            } else {
                fetch("http://www.google.com/search?q=joe+mama&tbm=isch").then(res => res.text()).then(str => {
                    var strings = []
                    var search = "<img class=\"t0fcAb\" alt=\"\" src=\"";
                    var stringsFound = 0;
                    var searchChar = search.length;
                    while (stringsFound < n && searchChar <= str.length) {
                        if (str.substring(searchChar - search.length, searchChar) == search) {
                            var endSearch = 0;
                            while (str.substring(searchChar + endSearch, searchChar + endSearch + 4) != "&amp") {
                                endSearch++;
                            }
                            strings.push(str.substring(searchChar, searchChar + endSearch));
                            stringsFound++;
                        }
                        searchChar++;
                    }
                    var toSend = []
                    var j = 0;
                    for (var i = 0; i < strings.length; i++) {
                        if ((toSend[j] + strings[i] + "\n").length > 2000) {
                            j++;
                        }
                        toSend[j] += strings[i] + "\n"
                    }
                    message.channel.send(`Here are the first ${n} pictures`)
                    for (var i = 0; i < toSend.length; i++) {
                        message.channel.send(toSend[i])
                    }
                });
            }
        }
    }
    if (message.content.toLowerCase() == `${config.prefix}crash`) {
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