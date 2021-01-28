const config = require('../../../config.json');
var pause = false;
module.exports = message => {
    var text = message.content.toLowerCase()
    if (pause && text == `${config.prefix}unpause`) {
        pause = false;
        message.channel.send("Unpaused instance this instance of the bot")
    }
    if (!pause && text == `${config.prefix}pause`) {
        pause = true;
        message.channel.send("Paused instance this instance of the bot")
    }
    return pause;
}