import { MessageEmbed } from "discord.js";
import { PrefixCommand } from "../../modules/commandutils";

export default new PrefixCommand({
    names: ["test"],
    action: ({ message }) => {
      var embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Some title")
        .setURL("https://discord.js.org/")
        .setAuthor(
          "Some name",
          "https://i.imgur.com/wSTFkRM.png",
          "https://discord.js.org"
        )
        .setDescription("Some description here")
        .setThumbnail("https://i.imgur.com/wSTFkRM.png")
        .addFields(
          { name: "Regular field title", value: "Some value here" },
          { name: "\u200B", value: "\u200B" },
          {
            name: "Inline field title",
            value: "Some value here",
            inline: true,
          },
          {
            name: "Inline field title",
            value: "Some value here",
            inline: true,
          },
          { name: "Inline field title", value: "Some value here", inline: true }
        )
        .addField("Inline field title", "Some value here", true)
        .setImage("https://i.imgur.com/wSTFkRM.png")
        .setTimestamp()
        .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");
      message.channel.send(embed);
    },
  })