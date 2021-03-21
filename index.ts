import Discord from 'discord.js'
import { CombinedHandler } from './modules/commandutils'
import * as config from './config.json'
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } })
require('dotenv').config()


client.once('ready', onReady)
client.login(process.env.TOKEN)


async function onReady() {
    console.log(`Logged in with user id ${client.user!.id}`)
    new CombinedHandler({
        client,
        admins: [config.members.toma],
        prefixCommandHandlerArgs: {
            prefix: 'joe!',
            commands: await (await import('./commands/prefix')).default
        },
        includesCommandHandlerArgs: {
            commands: await (await import('./commands/includes')).default
        },
        slashCommandHandlerArgs: {
            globalCommands:[],
            guildsCommands: [
                {
                    guild_id: config.guilds.nyf,
                    commands: await (await import('./commands/slash')).default
                }
            ]
        }
    });
}