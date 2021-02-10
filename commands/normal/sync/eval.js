const config = require('../../../config.json');
const { Message, Client } = require('discord.js');
module.exports = (message, client) => {
    if (message instanceof Message) {
        console.log('asd')
        var text = message.content.toLowerCase()
        if (text.startsWith(`${config.prefix}eval`)) {
            if (message.member.id == config.members.toma) {
                var code = message.content.substring(`${config.prefix}eval`.length)
                eval(code)
                try {
                } catch (e) {

                    message.channel.send("Exception: " + e)
                }
            } else {
                message.channel.send("Only TomaSajt can do that")
            }
        }
    }
}

async function delay(millis) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(0), millis)
    })
}

function repeat(func, period, times, start, end) {
    if (start instanceof Function) {
        start();
    }
    var i = 0;
    var interval = setInterval(_ => {
        func()
        i++;
        if (i>=times) {
            clearInterval(interval)
            if (end instanceof Function) {
                end();
            }
        }
    }, period);
}

function deleteNextMessage(channel, timeout) {
    channel.awaitMessages(msg => true, { max: 1, time: timeout, errors: ['time'] }).then(msgs => msgs.first()).then(msg => msg.delete()).catch(e => channel.send('Delete timed out'))
}