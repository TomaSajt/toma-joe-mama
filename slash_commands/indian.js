const Discord = require('discord.js');
const txtomp3 = require("text-to-mp3")
const fs = require("fs")
const filename = 'tts.mp3'

module.exports.definition = {
    data: {
        name: 'indian',
        description: 'Hello I am Will Smith from Microsoft and your computer has virus',
        options: [
            {
                "name": "text",
                "description": "Text to speak",
                "type": 3,
                "required": true
            }
        ]
    }
}
module.exports.action = async (interaction, client) => {
    if (interaction.data.name == "indian") {
        var guild = client.guilds.cache.get(interaction.guild_id)
        var channel = guild.channels.cache.get(interaction.channel_id)
        if (channel instanceof Discord.TextChannel) {
            try {
                var stream = await txtomp3.getMp3(interaction.data.options[0].value)
                var file = fs.createWriteStream(filename);
                file.write(stream);
                file.end();
                file.on("close", async () => {
                    await channel.send({
                        files: [filename]
                    })
                })

            } catch (e) {
                console.log("Error", e);
            }
        }
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 2 //ack
            }
        })
    }
}