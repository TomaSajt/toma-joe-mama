const Discord = require('discord.js');
const config = require('./config.json');
const stringify = require('./stringify.js');
const { pauseUnpauseCommand, isPaused } = require('./commands/special/sync/pause unpause.js');
const normalCommands = [
    require('./commands/normal/sync/karesz.js'),
    require('./commands/normal/sync/joe mama.js'),
    require('./commands/normal/sync/whos joe.js'),
    require('./commands/normal/sync/help.js'),
    require('./commands/normal/sync/pog.js'),
    require('./commands/normal/sync/shuffle.js')
]
const normalAsyncCommands = [
    require('./commands/normal/async/timer.js'),
    require('./commands/normal/async/crash.js'),
    require('./commands/normal/async/guess.js'),
    require('./commands/normal/async/gbruh.js')
]
const normalSlashCommands = [
    require('./slash_commands/tag.js'),
    require('./slash_commands/remote.js'),
]
const asyncSlashCommands = [
    require('./slash_commands/tts.js')
]
const client = new Discord.Client();
client.once('ready', () => {
    console.log('Restarted');
    
});

//Handle messages
client.on('message', async message => {

    //Pause logic
    if (message.author.bot) return;
    pauseUnpauseCommand(message);
    if (isPaused()) return;

    //Handle commands
    normalCommands.forEach(comm => comm(message))

    //Handle async commands
    normalAsyncCommands.forEach(async awComm => await awComm(message))
});
//Handle interactions
client.ws.on('INTERACTION_CREATE', async interaction => {
    if (isPaused()) return;

    //Log interaction
    console.log(stringify(interaction))

    //Handle slash commands
    normalSlashCommands.forEach(slashComm => slashComm.action(interaction, client))
    asyncSlashCommands.forEach(async slashComm => await slashComm.action(interaction, client))
    
})
//Login
client.login(config.token);

//Define or redefine slash commands
//normalSlashCommands.forEach(slashComm => client.api.applications(config.app_id).guilds(config.guilds.nyf).commands.post(slashComm.definition))
//asyncSlashCommands.forEach(slashComm => client.api.applications(config.app_id).guilds(config.guilds.nyf).commands.post(slashComm.definition))

//Log all commands
client.api.applications(config.app_id).guilds(config.guilds.nyf).commands.get().then(a => console.log(stringify(a)))
