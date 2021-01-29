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
module.exports.action = (client, interaction) => {
    if (interaction.data.name == "tag") {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: `<@${interaction.data.options[0].value}>`
                }
            }
        })
    }
}