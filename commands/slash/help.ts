import { MessageEmbed } from "discord.js";
import { SlashCommand } from "../../modules/commandutils";
import { BotEmbed } from "../../modules/embed_utils";

export default new SlashCommand({
    definition: {
        name: "help",
        description: "Shows the help menu",
    },
    action: async ({ channel, client, guild, sch, member }) => {
        var botMember = guild.members.resolve(client.user?.id!)!
        var ch = sch.handler
        var pch = ch.prefixHandler;
        var embed = new BotEmbed(client, guild, member)
            .setColor("#0099ff")
            .setTitle("Help menu")

        embed.addField("\u200B", "\u200B")
        for (const prefixCmd of pch.commands) {
            if (!prefixCmd.hidden) {
                embed.addField(`${pch.prefix}${prefixCmd.names[0]}`, prefixCmd.description ?? 'no description set')
            }
        }
        embed.addField("\u200B", "\u200B")
        for (const slashCmd of sch.commands) {
            if (!slashCmd.hidden) {
                embed.addField(`/${slashCmd.definition.name}`, slashCmd.definition.description)
            }
        }
        channel.send(embed)
    }
})