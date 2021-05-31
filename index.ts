import Discord from 'discord.js'
import { CombinedHandler, CommandLoader, IncludesCommand, PrefixCommand, SlashCommand } from './modules/commandutils'
import * as config from './config.json'
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } })
require('dotenv').config()
client.login(process.env.TOKEN)




client.once('ready', async ()=>{
    console.log(`Logged in with user id ${client.user!.id}`)
    client.on('rateLimit',console.log)
    new CombinedHandler({
        client,
        admins: [config.members.toma],
        prefixCommandHandlerArgs: {
            prefix: 'joe!',
            commands: await new CommandLoader<PrefixCommand>('./commands/prefix').loadCommands()
        },
        includesCommandHandlerArgs: {
            commands: await new CommandLoader<IncludesCommand>('./commands/includes').loadCommands()
        },
        slashCommandHandlerArgs: {
            globalCommands:[],
            guildsCommands: [
                {
                    guild_id: config.guilds.nyf,
                    commands: await new CommandLoader<SlashCommand>('./commands/slash/guild').loadCommands()
                }
            ]
        }
    });
})


