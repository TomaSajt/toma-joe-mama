const Discord = require('discord.js');
const config = require('./config.json');
const { pauseUnpauseCommand, isPaused } = require('./commands/special/sync/pause unpause.js');
const normalCommands = [
    require('./commands/normal/sync/karesz.js'),
    require('./commands/normal/sync/joe mama.js'),
    require('./commands/normal/sync/whos joe.js'),
    require('./commands/normal/sync/help.js'),
    require('./commands/normal/sync/pog.js')
]
const normalAwaitCommands = [
    require('./commands/normal/async/timer.js'),
    require('./commands/normal/async/crash.js')
]
const client = new Discord.Client();
client.once('ready', () => {
    console.log('Restarted');
    
});
client.on('message', async message => {
    if (message.author.bot) return;
    if (pauseUnpauseCommand(message)) return;
    normalCommands.forEach(comm => comm(message))
    normalAwaitCommands.forEach(async awComm => await awComm(message))
    
});
client.ws.on('INTERACTION_CREATE', async interaction => {
    if (isPaused()) return;
    console.log(interaction)
    if (interaction.data.name == "tag") {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: `<@${interaction.data.options[0].value}>`
                }
            }
        })
    }
    if (interaction.data.name == "remote") {
        var guild = client.guilds.cache.get(interaction.guild_id)
        var channel = guild.channels.cache.get(interaction.data.options[0].value);
        if (interaction.member.roles.includes(config.roles.remote)) {
            if (channel instanceof Discord.TextChannel) {
                channel.send(interaction.data.options[1].value)
            }
        } else {
            if (channel instanceof Discord.TextChannel) {
                channel.send("You dont have the permissions to do that")
            }
        }
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 2
            }
        })
    }
    
})
client.login(config.token);
client.api.applications(config.app_id).guilds(config.guilds.nyf).commands.post({
    data: {
        name: 'tag',
        description: 'pings a person',
        options: [
            {
                "name": "member",
                "description": "Who to @",
                "type": 6,
                "required": true
            }
        ]
    }
})
client.api.applications(config.app_id).guilds(config.guilds.nyf).commands.post({
    data: {
        name: 'remote',
        description: 'pings a person',
        options: [
            {
                "name": "channel",
                "description": "Channel to send message to",
                "type": 7,
                "required": true
            },
            {
                "name": "message",
                "description": "The message to send",
                "type": 3,
                "required": true
            }
        ]
    }
})

client.api.applications(config.app_id).guilds(config.guilds.nyf).commands.get().then(a => console.log(a))

