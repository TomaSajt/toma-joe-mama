import { SlashCommand } from "../../modules/commandutils";
import Discord from 'discord.js';

export const cmd = new SlashCommand({

    definition: {
        name: 'tag',
        description: 'Tags a person',
        options: [
            {
                name: "member",
                description: "Who to tag",
                type: 6,
                required: true
            }
        ]
    },
    action: (client, interaction) => {
        var guild = client.guilds.cache.get(interaction.guild_id!)!
        var channel = guild.channels.cache.get(interaction.channel_id!)
        if (channel instanceof Discord.TextChannel) {
            channel.send(`Hello <@${interaction.data!.options![0].value}>`)
        }
        //@ts-ignore
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 2 //ack
            }
        })

    }
})