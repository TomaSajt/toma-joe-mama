const config = require('../../../config.json');
module.exports = async (message, client) => {
    var text = message.content.toLowerCase()
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
                            if (i % 5 == 0 || i < 5) {
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
}

async function delay(millis) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(0), millis)
    })
}