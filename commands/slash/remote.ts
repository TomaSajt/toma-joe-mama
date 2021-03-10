import { SlashCommand } from "../../modules/commandutils";
import Discord from 'discord.js';

export const cmd = new SlashCommand({

    definition: {
        name: 'remote',
        description: 'Sends a given message to the given channel',
        options: [
            {
                name: "channel",
                description: "Channel to send message to",
                type: 7,
                required: true
            },
            {
                name: "message",
                description: "The message to send",
                type: 3,
                required: true
            }
        ]

    },
    action: ({ client, interaction }) => {
        var guild = client.guilds.cache.get(interaction.guild_id!)!
        var channelToSend = guild.channels.cache.get(interaction.data!.options![0].value!)!;
        var channelSentIn = guild.channels.cache.get(interaction.channel_id!)!;
        if (channelToSend instanceof Discord.TextChannel) {
            channelToSend.send(interaction.data!.options![1].value)
        }
        //@ts-ignore
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 2 //ack
            }
        })

    }
})