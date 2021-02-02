const config = require('../../../config.json');
var crashing = false;
module.exports = async (message, client) => {
    var text = message.content.toLowerCase()
    if (text == `${config.prefix}crash`) {
        if (message.member.id == config.members.toma) {
            if (!crashing) {
                crashing = true;
                message.channel.send("crashing in 3")
                await delay(1000)
                message.channel.send("crashing in 2")
                await delay(1000)
                message.channel.send("crashing in 1")
                await delay(1000)
                message.channel.send("crashed")
                await delay(100)
                thisIsntSupposedToExist;
            }
        } else {
            message.channel.send("only TomaSajt can do that")
        }
    }
}

async function delay(millis) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(0), millis)
    })
}