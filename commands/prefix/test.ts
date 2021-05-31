import { MessageEmbed } from "discord.js";
import { PrefixCommand } from "../../modules/commandutils";
import {MessageButton} from 'discord-buttons'

export default new PrefixCommand({
  names: ["test"],
  action: async ({ message, client }) => {
    var button = new MessageButton().setStyle('red').setLabel('Click me to do nothing').setID('nothing');
    console.log(button)
    //@ts-ignore
    console.log(await message.channel.send("hello", button))
  },
  description: 'command for testing'
})