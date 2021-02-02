const config = require('../../../config.json');
const txtomp3 = require("text-to-mp3")
const fs = require("fs")
const filename = 'tts.mp3'
module.exports = async (message, client) => {
    var text = message.content.toLowerCase()
    if (text.startsWith(`${config.prefix}tts`)) {
        var str = message.content.substring(`${config.prefix}tts`.length).trim()
        try {
            var stream = await txtomp3.getMp3(str)
            var file = fs.createWriteStream(filename);
            file.write(stream);
            file.end();
            file.on("close", async () => {
                await message.channel.send({
                    files: [filename]
                })
            })

        } catch (e) {
            console.log("Error", e);
        }
    }
}