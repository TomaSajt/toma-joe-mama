const config = require('../../../config.json');
const { Message, TextChannel } = require('discord.js');
module.exports = async (message, client) => {
    var text = message.content.toLowerCase()
    if (text == `${config.prefix}guess`) {
        if (message instanceof Message) {
            var member = message.member;
            var channel = message.channel;
            await myfunction(Math.floor(Math.random()*100), member, channel)
        }
    }
}

async function myfunction(number, member, channel) {
    if (channel instanceof TextChannel) {
        const filter = m => m.member.id == member.id && !isNaN(parseInt(m.content))
        try {
            var msgs = await channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
            var msg = msgs.first();
            var guess = parseInt(msg.content);
            if (guess > number) {
                channel.send(`The number is lower than ${guess}`)
                await myfunction(number, member, channel)
            }
            if (guess < number) {
                channel.send(`The number is higher than ${guess}`)
                await myfunction(number, member, channel)
            }
            if (guess == number) {
                channel.send(`You got it! The correct number was ${number}`)
            }
        } catch {
            channel.send("You did not send anything in the 10 sec time period")
        }
        

    }
}