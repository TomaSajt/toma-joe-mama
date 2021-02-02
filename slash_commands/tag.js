const Discord = require('discord.js');
const config = require('../config.json');

module.exports.definition = {
    data: {
        name: 'tag',
        description: 'pings a person',
        options: [
            {
                "name": "member",
                "description": "Who to @",
                "type": 6,
                "required": true
            }
        ]
    }
}
module.exports.action = (interaction, client) => {
    if (interaction.data.name == "tag") {
        var guild = client.guilds.cache.get(interaction.guild_id)
        var channel = guild.channels.cache.get(interaction.channel_id)
        if (channel instanceof Discord.TextChannel) {
            channel.send(`<@${interaction.data.options[0].value }>`)
        }
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 2 //ack
            }
        })
    }
}