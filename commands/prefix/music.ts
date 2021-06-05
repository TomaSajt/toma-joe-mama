import { PrefixCommand } from "../../modules/commandutils";
import { GuildChannel, TextChannel, VoiceConnection } from "discord.js";
import { GetSong, Music } from '../../managers/MusicManager'

export default new PrefixCommand({
    names: ["music"],
    bypassPause: false,
    adminOnly: false,
    action: async ({ args, message, client }) => {
        if (!message.member) return
        if (!(message.channel instanceof TextChannel)) return

        switch (args[0]) {
            case 'join':
                if (!message.member.voice.channel) break
                await Music.getGuildMusicManager(message.guild!).joinChannel(message.member.voice.channel)
                break;

            case 'play':
                Music.getGuildMusicManager(message.guild!).addQueueTryPlay(GetSong(args[1]), message.channel)
                break;
            case 'leave':
                break;

            default:
                message.channel.send("unknown arg")
                break;
        }
    },
    description: 'Music, music, music and music'
})