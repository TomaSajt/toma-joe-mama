module.exports = (message) => {
    var text = message.content.toLowerCase()
    if (text.includes("joe") && (text.includes("who's") || text.includes("who is") || text.includes("whos") || text.includes("who s"))) {
        message.channel.send("joe mama")
    }
}