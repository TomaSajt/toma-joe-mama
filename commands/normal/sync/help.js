const config = require('../../../config.json');
module.exports = (message, client) => {
    var text = message.content.toLowerCase()
    if (text == `${config.prefix}help`) {
        message.channel.send("There is no helping you...")
    }
}