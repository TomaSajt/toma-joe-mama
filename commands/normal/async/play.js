const config = require('../../../config.json');
const { Message } = require('discord.js');
const ytdl = require('ytdl-core-discord');
module.exports = async (message, client) => {
    if (message instanceof Message) {
        var text = message.content.toLowerCase()
        if (text.startsWith(`${config.prefix}play`)) {
            try {
                var args = message.content.substring(`${config.prefix}play`.length).trim().split().filter(str => str != "");
                var voiceConnection = await message.member.voice.channel.join();
                const broadcast = client.voice.createBroadcast();
                ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ').then(stream => {
                    broadcast.play(stream, { type: 'opus' });
                    voiceConnection.play(broadcast);
                }).catch(e => console.log(e));

            } catch (e) {
                console.log(e);
            }
        }
    }
}