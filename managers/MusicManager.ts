import { Guild, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js'
import { Readable } from 'stream'
import ytdl from 'ytdl-core-discord'


class MusicManger {

    guildMap = new Map<Guild, GuildMusicManager>()

    getGuildMusicManager(guild: Guild) {
        var gmm = this.guildMap.get(guild)
        if (!gmm) {
            gmm = new GuildMusicManager()
            this.guildMap.set(guild, gmm)
        }
        return gmm
    }

}
class GuildMusicManager {

    queue: SongQueue = new SongQueue()
    connection: VoiceConnection | undefined

    async joinChannel(channel: VoiceChannel) {
        this.connection = (await channel.join()).on('closing', () => this.queue.clear())
    }

    addQueueTryPlay(song: Song, msgChannel: TextChannel) {
        if (this.connection) {
            this.queue.enqueueSong(song)
            if (this.queue.length() == 1) {
                this.playNext(msgChannel)
            }
        } else {
            msgChannel.send(`Bot is not connected to a channel`)
        }
    }

    private async playNext(msgChannel: TextChannel) {
        if (this.connection) {
            var song = this.queue.dequeueSong()
            if (song) {
                try {
                    var stream = song.getStream()
                    msgChannel.send(`Now playing ${song.name}\n${song.url}`)
                    this.connection.play(await song.getStream(), { type: 'opus' })
                        .on("finish", () => {
                            this.playNext(msgChannel)
                        })
                } catch (error) {
                    msgChannel.send('Steam not valid')
                    this.playNext(msgChannel)
                }
            } else {
                msgChannel.send('Queue is empty')
            }
        }
    }

}
class SongQueue {
    private innerQueue: Song[] = []

    dequeueSong() {
        return this.innerQueue.shift()
    }
    enqueueSong(song: Song) {
        this.innerQueue.push(song)
    }
    clear() {
        this.innerQueue = []
    }
    length() {
        return this.innerQueue.length
    }
}

export const Music = new MusicManger()
export type Song = {
    name: string
    url: string
    getStream: (...args: any[]) => Promise<Readable>
}
export function GetSong(url: string): Song {
    return {
        name: "Unkown title",
        url,
        getStream: async () => await ytdl(url)
    }
}
