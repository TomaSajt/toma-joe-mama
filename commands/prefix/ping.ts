import { PrefixCommand } from "../../modules/commandutils";

export default new PrefixCommand({
    names: ["ping", "ping-me", "ping-pong"],
    action: ({ message, client }) => {
      message.channel.send(
        `🏓Latency is ${
          Date.now() - message.createdTimestamp
        }ms. API Latency is ${Math.round(client.ws.ping)}ms`
      );
    },
  })