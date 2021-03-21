import { PrefixCommand } from "../../modules/commandutils";

var timerDone = true
export default new PrefixCommand({
    names: ["timer"],
    bypassPause: false,
    adminOnly: false,
    action: async ({ message, args }) => {
      if (args.length == 1) {
        var n = parseInt(args[0]);
        if (n || n == 0) {
          if (n >= 1 && n <= 300) {
            if (timerDone) {
              timerDone = false;
              var m = await message.channel.send(
                `starting countdown for ${n} seconds`
              );
              for await (var remaining of countdownGenerator(n)) {
                if (m.deleted) break;
                m.edit(remaining);
              }
              if (!m.deleted) message.channel.send("countdown over");
              timerDone = true;
            } else {
              message.channel.send("Another timer is currently running");
            }
          } else {
            message.channel.send(
              "You can only start a timer with time between 1 and 300 seconds"
            );
          }
        } else {
          message.channel.send("Argument not of type 'number'");
        }
      } else {
        message.channel.send("Ivalid argument amount");
      }
      
    },
  })

  async function* countdownGenerator(n: number) {
    yield n;
    while (n > 0) {
      await delay(1000);
      yield --n;
    }
  }

  async function delay(millis: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(0), millis);
    });
  }