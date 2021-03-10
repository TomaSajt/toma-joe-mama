import { PrefixCommand } from "../../modules/commandutils";

export const cmd = new PrefixCommand({
    names: ['timer'],
    bypassPause: false,
    adminOnly: true,
    action: async ({pch, name, message}) => {
        var key = pch.prefix + name
        var inputArgs = message.content.substring(message.content.indexOf(key) + key.length).trim().split(' ').filter(str => str != "");
        if (inputArgs.length == 1) {
            var n = parseInt(inputArgs[0])
            if (n) {
                var m = await message.channel.send(`starting countdown for ${n} seconds`)
                for await (var remaining of countdown(n)) {
                    if (m.deleted) break;
                    m.edit(remaining)
                }
                if (!m.deleted) message.channel.send('countdown over')
            } else {
                message.channel.send("Argument not of type 'number'")
            }
        } else {
            message.channel.send('Ivalid argument amount')
        }
    }
});


async function* countdown(n: number) {
    yield n
    while (n > 0) {
        await delay(1000)
        yield --n
    }
}

async function delay(millis: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(0), millis)
    })
}