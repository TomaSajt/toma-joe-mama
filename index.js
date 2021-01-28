const Discord = require('discord.js');
const config = require('./config.json');
var crashing = false;
const pauseUnpauseCommand = require('./commands/special/sync/pause unpause.js');
var normalCommands = [
    require('./commands/normal/sync/karesz.js'),
    require('./commands/normal/sync/joe mama.js'),
    require('./commands/normal/sync/whos joe.js'),
    require('./commands/normal/sync/help.js'),
    require('./commands/normal/sync/pog.js')
]
var normalAwaitCommands = [
    require('./commands/normal/async/timer.js'),
    require('./commands/normal/async/crash.js')
]

var client = new Discord.Client();
client.once('ready', () => {
    console.log('Restarted');
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (pauseUnpauseCommand(message)) return;
    normalCommands.forEach(comm => comm(message))
    normalAwaitCommands.forEach(async awComm => await awComm(message))
    
});
client.login(config.token);