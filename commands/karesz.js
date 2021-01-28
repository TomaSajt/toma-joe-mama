const config = require('../config.json');
module.exports = (message) => {
    var text = message.content.toLowerCase()
    if (text.includes("karesz")) {
        var found = false;
        if (text.includes("down")) {
            found = true;
            message.react(config.emotes.kareszdown);
        }
        if (text.includes("up")) {
            found = true;
            message.react(config.emotes.kareszup);
        }
        if (text.includes("left")) {
            found = true;
            message.react(config.emotes.kareszleft);
        }
        if (text.includes("right")) {
            found = true;
            message.react(config.emotes.kareszright);
        }
        if (!found) {
            message.react(config.emotes.karesz)
        }
    }
}