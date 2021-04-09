import { Client, Guild, GuildMember, MessageEmbed } from "discord.js";

export class BotEmbed extends MessageEmbed {
    constructor(client: Client, guild: Guild, member: GuildMember) {
        super()
        var botMember = guild.members.resolve(client.user?.id!)!
        this.author = { name: botMember.displayName, iconURL: botMember.user.avatarURL({ dynamic: true }) ?? undefined}
        this.footer = { text: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) ?? undefined}
    }
}