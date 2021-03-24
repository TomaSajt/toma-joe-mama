import { TextChannel } from "discord.js";
import { SlashCommand } from "../../modules/commandutils";

export default new SlashCommand({
  definition: {
    name: "remote",
    description: "Sends a given message to the given channel",
    options: [
      {
        name: "channel",
        description: "Channel to send message to",
        type: 7,
        required: true,
      },
      {
        name: "message",
        description: "The message to send",
        type: 3,
        required: true,
      },
    ],
  },
  action: ({ args, guild }) => {
    var channelToSend = guild.channels.cache.get(args.channel)!;
    if (channelToSend instanceof TextChannel) {
      channelToSend.send(args.message);
    }
  },
})