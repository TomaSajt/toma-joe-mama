import Discord from 'discord.js'
import * as CommUtils from './modules/commandutils'
import * as config from './config.json'
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL)}})

client.login(config.token)


client.once('ready', () => {
    console.log('logged in')
})

var mainHandler = new CommUtils.Handler({ client: client, prefix: 'joe!' })

var asd = new CommUtils.Command({ names: ['bruh'], action: (client, message) => { message.channel.send('bruh') } });

mainHandler.registerCommand(asd)