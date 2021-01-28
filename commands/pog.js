module.exports = (message) => {
    var text = message.content.toLowerCase()
    if (text.includes("pog")) {
        message.react(config.emotes.ruvipog)
    }
}