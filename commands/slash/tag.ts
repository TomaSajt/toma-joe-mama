import { SlashCommand } from "../../modules/commandutils";

export default new SlashCommand({
  definition: {
    name: "tag",
    description: "Tags a person",
    options: [
      {
        name: "member",
        description: "Who to tag",
        type: 6,
        required: true,
      },
    ],
  },
  action: ({ args, channel }) => {
    channel.send(`Hello <@${args.member}>`);
  },
})