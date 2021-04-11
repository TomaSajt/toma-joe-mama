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
    console.log(json)
    var embed = new BotEmbed(client, guild, member).setTitle(`Information about ${args.ip}`).setColor('#00aff4')
    for (const key in json) {
      const value = json[key];
      var valueToSend = value
      if (typeof value == 'boolean') {
        valueToSend = value ? "Yes" : "No"
      } else if(value == undefined || value == '') {
        valueToSend = "???"
      }
      embed = embed.addField(key, valueToSend, true)
    }
    if (json.lat && json.lon) {
      embed.addField('Location on Google Maps', `https://www.google.com/maps/@${json.lat},${json.lon},15z`)
    }
    channel.send(embed)
  },
})