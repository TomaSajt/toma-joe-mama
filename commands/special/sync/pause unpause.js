const config = require('../../../config.json');
var pause = false;
module.exports = message => {
    var text = message.content.toLowerCase()
    if (pause && text == `${config.prefix}unpause`) {
        message.channel.send("Unpaused instance this instance of the bot")
        pause = false;
    }
    if (!pause && text == `${config.prefix}pause`) {
        message.channel.send("Paused instance this instance of the bot")
        pause = true;
    }
    return pause;
}