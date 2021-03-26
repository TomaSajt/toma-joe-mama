import { SlashCommand } from "../../modules/commandutils";

export default new SlashCommand({
  definition: {
    name: "quiz",
    description: "Creates a quiz",
    options: [
      {
        name: "question",
        description: "The question asked",
        type: 3,
        required: true,
      },
      {
        name: "correct",
        description: "The correct option",
        type: 4,
        required: true,
      },
      {
        name: "option_1",
        description: "Option 1",
        type: 3,
        required: true,
      },
      {
        name: "option_2",
        description: "Option 2",
        type: 3,
        required: true,
      },
      {
        name: "option_3",
        description: "Option 3",
        type: 3,
        required: false,
      },
      {
        name: "option_4",
        description: "Option 4",
        type: 3,
        required: false,
      },
      {
        name: "option_5",
        description: "Option 5",
        type: 3,
        required: false,
      },
      {
        name: "option_6",
        description: "Option 6",
        type: 3,
        required: false,
      },
    ],
  },
  action: ({ args, channel, member, client }) => {
    // var embed = new MessageEmbed()
    //   .setColor("#0099ff")
    //   .setTitle("Quiz")
    //   .setAuthor(
    //     member.displayName,
    //     member.user.avatarURL({dynamic:true}) ?? undefined
    //   )
    //   .addFields(
    //     { name: args.question, value: "\u200B" },
    //     { name: "\u200B", value: "\u200B" },
    //     {
    //       name: "Option 1",
    //       value: args.option_1,
    //       inline: true,
    //     },
    //     {
    //       name: "Option 2",
    //       value: args.option_2,
    //       inline: true,
    //     }
    //   )

    // if (args.option_3) {
    //   embed = embed.addFields(
    //     {
    //       name: "Option 3",
    //       value: args.option_3,
    //       inline: true,
    //     }
    //   )
    //   if (args.option_4) {
    //     embed = embed.addFields(
    //       {
    //         name: "Option 4",
    //         value: args.option_4,
    //         inline: true,
    //       }
    //     )
    //     if (args.option_5) {
    //       embed = embed.addFields(
    //         {
    //           name: "Option 5",
    //           value: args.option_5,
    //           inline: true,
    //         }
    //       )
    //       if (args.option_6) {
    //         embed = embed.addFields(
    //           {
    //             name: "Option 6",
    //             value: args.option_6,
    //             inline: true,
    //           }
    //         )
    //       }
    //     }
    //   }
    // }
    // console.log('asd')
    // embed = embed.setTimestamp().setFooter("JMB quiz", client.user?.avatarURL({dynamic:true}) ?? undefined);
    channel.send('asd');
  },
})