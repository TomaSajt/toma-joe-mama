const Discord = require('discord.js');
const config = require('../config.json');

module.exports.definition = {
    data: {
        name: 'remote',
        description: 'Sends a given message to the given channel',
        options: [
            {
                "name": "channel",
                "description": "Channel to send message to",
                "type": 7,
                "required": true
            },
            {
                "name": "message",
                "description": "The message to send",
                "type": 3,
                "required": true
            }
        ]

    }
}
module.exports.action = (client, interaction) => {
    if (interaction.data.name == "remote") {
        var guild = client.guilds.cache.get(interaction.guild_id)
        var channelToSend = guild.channels.cache.get(interaction.data.options[0].value);
        var channelSentIn = guild.channels.cache.get(interaction.channel_id);
        if (interaction.member.roles.includes(config.roles.remote)) {
            if (channelToSend instanceof Discord.TextChannel) {
                channelToSend.send(interaction.data.options[1].value)
            }
        } else {
            if (channelSentIn instanceof Discord.TextChannel) {
                channelSentIn.send("You dont have the permissions to do that")
            }
        }
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 2
            }
        })
    }
}