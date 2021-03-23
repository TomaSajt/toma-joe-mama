import { TextChannel } from "discord.js";
import { SlashCommand } from "../../modules/commandutils";

export default new SlashCommand({
  definition: {
    name: "bruh",
    description: "Bruh moment",
  },
  action: async ({ channel }) => {
    var msg = await channel.send("🗿 🗿 🗿 🗿 🗿");
    await msg.react("🅱️");
    await msg.react("🇷");
    await msg.react("🇺");
    await msg.react("🇭");
  }
})