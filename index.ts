import Discord from 'discord.js'
import { ComplexHandler } from './modules/commandutils'
import * as config from './config.json'
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } })
require('dotenv').config()


client.once('ready', onReady)
client.login(process.env.TOKEN)
async function onReady() {
    console.log(`Logged in with user id ${client.user!.id}`)
    new ComplexHandler({
        client: client,
        admins: [config.members.toma],
        prefixCommandHandlerArgs: {
            prefix: 'joe!',
            commands: [
                (await import('./commands/prefix/test_commands')).test,
                (await import('./commands/prefix/test_commands')).ping,
                (await import('./commands/prefix/pause_commands')).pause,
                (await import('./commands/prefix/pause_commands')).unpause
            ]
        },
        includesCommandHandlerArgs: {
            commands: [
                (await import('./commands/includes/includes_react_commands')).pog,
                (await import('./commands/includes/whos_joe_mama')).whos_joe,
                (await import('./commands/includes/whos_joe_mama')).joe_mama
            ]
        },
        slashCommandHandlerArgs: {
            commands: [
                (await import('./commands/slash/tts')).cmd
            ]
        }
    });
}