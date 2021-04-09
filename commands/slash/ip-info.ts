import { SlashCommand } from "../../modules/commandutils";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";
import { BotEmbed } from "../../modules/embed_utils";

export default new SlashCommand({
  definition: {
    name: "ip-info",
    description: "Gets the information about the given ip",
    options: [
      {
        name: "ip",
        description: "The IP address",
        type: 3,
        required: true,
      },
    ],
  },
  action: async ({ args, channel, client, guild, member }) => {
    var response = await fetch(`http://ip-api.com/json/${args.ip}?fields=66846719`)
    var json = await response.json();
    var embed = new BotEmbed(client, guild, member).setTitle(`Information about ${args.ip}`)
    for (const key in json) {
      const value = json[key];
      embed = embed.addField(key, value != '' && value ? value : '\u200B')
    }
    channel.send(embed)
  },
})