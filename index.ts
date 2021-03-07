import Discord from 'discord.js'
import { Handler } from './modules/commandutils'
import * as config from './config.json'
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } })

require('dotenv').config()


client.once('ready', () => {
    console.log('Ready')
})
async function createHandler() {
    var mainHandler = new Handler({
        client: client,
        admins: [config.members.toma],
        pchArgs: {
            prefix: 'joe!',
            commands: [
                (await import('./commands/prefix/test_commands')).test,
                (await import('./commands/prefix/test_commands')).ping,
                (await import('./commands/prefix/pause_commands')).pause,
                (await import('./commands/prefix/pause_commands')).unpause
            ]
        },
        ichArgs: {
            commands: [
                (await import('./commands/includes/react_commands')).pog
            ]
        }
    });
}

client.login(process.env.TOKEN)
createHandler()
