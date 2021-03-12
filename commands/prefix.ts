import { MessageEmbed } from "discord.js";
import { PrefixCommand } from "../modules/commandutils";
const webp = require('webp-converter')
const fs = require('fs')
const https = require('https')
var asciify = require('asciify-image');
import fetch from 'node-fetch'


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
        names: ['member'],
        action: ({ message }) => {
            if (!fs.existsSync('avatars')) {
                fs.mkdirSync('avatars')
            }
            var arr = message.content.trim().split(' ')
            var victim = message.guild!.members.cache.get(arr[arr.length - 1])!
            const url = victim.user.avatarURL({ dynamic: true })!
            const extension = url.substring(url.lastIndexOf('.') + 1)
            const path = "avatars/." + extension;
            const file = fs.createWriteStream(path);
            console.log(extension)
            const request = https.get(url, function (response: any) {

                response.pipe(file)
                if (extension == 'webp') {
                    const result = webp.dwebp(path, "avatars/done.png", "-o");
                    result.then((response: any) => {
                        asciifyPath('avatars/done.png')
                    });
                } else if (extension == 'gif') {
                    asciifyPath('avatars/.gif')
                }
            });
            function asciifyPath(path: string) {
                var options = {
                    fit: 'box',
                    width: 62,
                    height: 31
                }
                asciify(path, options, function (err: any, asciified: any) {
                    if (err) throw err;
                    // Print to console
                    console.log(asciified);
                });
            }

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
        action: async ({ pch, message, name }) => {
            var key = pch.prefix + name
            var searchArgs = message.content.substring(message.content.indexOf(key) + key.length).trim().split(' ').filter(str => str != "");
            var json = await gbSearch(searchArgs, 3)
            var str = json.map(entry => entry.file_url).reduce((allRows, nextRow) => allRows + "\n" + nextRow)
            message.channel.send(str)
            
        }
    }),
    new PrefixCommand({
        names: ['timer'],
        bypassPause: false,
        adminOnly: true,
        action: async ({ pch, name, message }) => {
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
        }
    })
]






































































































//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound
//Bruh moment inbound







async function gbSearch(arr: string[], limit: number): Promise<{ file_url: string }[]> {
    var tagsString = "";
    arr.forEach(tag => {
        tagsString += tag + "+"
    })
    var response = await fetch(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&api_key=69c6a9eec964e78c52f32440132168ea819e2b5947543ccce4589f487ad9ad09&user_id=731181&limit=${limit}&tags=${tagsString}` + tagsString)
    return await response.json();
}