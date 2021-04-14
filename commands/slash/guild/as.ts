import { TextChannel } from "discord.js";
import { SlashCommand } from "../../../modules/commandutils";

export default new SlashCommand({
  adminOnly: false,
  definition: {
    name: "as",
    description: "Sends a message in the name of a person",
    options: [
      {
        name: "member",
        description: "Who to impersonate as",
        type: 6,
        required: true,
      },
      {
        name: "message",
        description: "The message to send",
        type: 3,
        required: true,
      },
      {
        name: "channel",
        description: "The channel to send the message in",
        type: 7,
        required: false,
      },
    ],
  },
  action: async ({ args, guild, channel }) => {
    var textChannel = channel
    var member = guild.members.cache.get(args.member)!;
    if (args.channel) {
      var temp = guild.channels.cache.get(args.channel)!
      if (temp instanceof TextChannel) {
        textChannel = temp;
      }
    }
    var webhook = await textChannel.createWebhook(member.displayName, {
      avatar: member.user.avatarURL({ dynamic: true }) ?? undefined,
    });
    await webhook.send(args.message);
    webhook.delete();
  },
})