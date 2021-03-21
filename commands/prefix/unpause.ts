import { PrefixCommand } from "../../modules/commandutils";

export default new PrefixCommand({
    names: ["unpause", "resume"],
    bypassPause: true,
    adminOnly: true,
    action: ({ pch, message }) => {
      if (pch.handler.paused) {
        pch.handler.paused = false;
        message.channel.send("Unpaused the handler.");
      }
    },
  })