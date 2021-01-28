module.exports = (message) => {
    var text = message.content.toLowerCase()
    if (text.includes("joe mama")) {
        message.channel.send(`> You are almost as funny as me ${message.author}`, { files: [randomPicture()] })
    }
}

function randomPicture() {
    var pictures = []
    pictures.push("https://i.imgur.com/Fl4DpvB.jpg")
    pictures.push("https://i.imgur.com/NEZEOhS.gif")
    pictures.push("https://i.imgur.com/6iueg8x.png");
    return pictures[Math.floor(Math.random() * pictures.length)]
}