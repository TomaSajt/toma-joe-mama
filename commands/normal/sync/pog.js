const config = require('../../../config.json');
module.exports = (message, client) => {
    var text = message.content.toLowerCase()
    if (text.includes("pog")) {
        message.react(config.emotes.ruvipog)
    }
}