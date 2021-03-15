import { MessageEmbed } from "discord.js";
import { PrefixCommand } from "../modules/commandutils";
import fetch from 'node-fetch'

var timerDone = true


export const cmds = [
    new PrefixCommand({
        names: ['pause'],
        bypassPause: true,
        adminOnly: true,
        action: ({ pch, message }) => {
            if (!pch.handler.paused) {
                pch.handler.paused = true;
                message.channel.send('Paused the handler.')
            }
        }
    }),
    new PrefixCommand({
        names: ['unpause', 'resume'],
        bypassPause: true,
        adminOnly: true,
        action: ({ pch, message }) => {
            if (pch.handler.paused) {
                pch.handler.paused = false;
                message.channel.send('Unpaused the handler.')
            }
        }
    }),
    new PrefixCommand({
        names: ['test'],
        action: ({ message }) => {

            var embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Some title')
                .setURL('https://discord.js.org/')
                .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                .addFields(
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addField('Inline field title', 'Some value here', true)
                .setImage('https://i.imgur.com/wSTFkRM.png')
                .setTimestamp()
                .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
            message.channel.send(embed)
        }
    }),
    new PrefixCommand({
        names: ['ping', 'ping-me', 'ping-pong'],
        action: ({ message, client }) => { message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`); }
    }),
    new PrefixCommand({
        names: ['gbruh'],
        bypassPause: false,
        adminOnly: true,
        action: async ({ message, args }) => {
            var json = await gbSearch(args, 3)
            var str = json.map(entry => entry.file_url).reduce((allRows, nextRow) => allRows + "\n" + nextRow)
            message.channel.send(str)

            async function gbSearch(searchTerms: string[], limit: number): Promise<{ file_url: string }[]> {
                var response = await fetch(`${process.env.GBLINK}limit=${limit}&tags=${searchTerms.join('+')}`)
                return await response.json();
            }
        }
    }),
    new PrefixCommand({
        names: ['timer'],
        bypassPause: false,
        adminOnly: true,
        action: async ({ message, args }) => {
            if (args.length == 1) {
                var n = parseInt(args[0])
                if (n || n == 0) {
                    if (n >= 1 && n <= 300) {
                        if (timerDone) {
                            timerDone = false
                            var m = await message.channel.send(`starting countdown for ${n} seconds`)
                            for await (var remaining of countdownGenerator(n)) {
                                if (m.deleted) break;
                                m.edit(remaining)
                            }
                            if (!m.deleted) message.channel.send('countdown over')
                            timerDone = true
                        } else {
                            message.channel.send("Another timer is currently running")
                        }
                    } else {
                        message.channel.send("You can only start a timer with time between 1 and 300 seconds")
                    }
                } else {
                    message.channel.send("Argument not of type 'number'")
                }
            } else {
                message.channel.send('Ivalid argument amount')
            }
            async function* countdownGenerator(n: number) {
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
        }
    })
]
