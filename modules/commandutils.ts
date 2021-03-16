import Discord, { APIMessage, Snowflake, TextChannel } from 'discord.js'
import { Interaction, Definition, InteractionResponse } from './discord_type_extension'
import * as SlashUtils from './slash_utils'

type CombinedHandlerArgs = {
    client: Discord.Client,
    admins?: string[],
    prefixCommandHandlerArgs: PrefixCommandHandlerArgs
    includesCommandHandlerArgs: IncludesCommandHandlerArgs
    slashCommandHandlerArgs: SlashCommandHandlerArgs
}
type PrefixCommandHandlerArgs = {
    prefix: string,
    commands: PrefixCommand[]
}
type IncludesCommandHandlerArgs = {
    commands: IncludesCommand[]
}
type SlashCommandHandlerArgs = {
    globalCommands: SlashCommand[]
    guildsCommands: {
        guild_id: Snowflake
        commands: SlashCommand[]
    }[]
}

type CommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean,
}
type PrefixCommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean,
    names: string[],
    action: (args: PrefixCommandActionArgs) => void
}
type IncludesCommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean,
    names: string[],
    action: (args: IncludesCommandActionArgs) => void
}
type IncludesReactCommandArgs = {
    names: string[],
    emoji: Discord.EmojiIdentifierResolvable
}
type SlashCommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    definition: Definition,
    action: (args: SlashCommandActionArgs) => void
}

type PrefixCommandActionArgs = {
    client: Discord.Client,
    message: Discord.Message,
    pch: PrefixCommandHandler,
    name: string,
    args: string[]
}
type IncludesCommandActionArgs = {
    client: Discord.Client,
    message: Discord.Message,
    ich: IncludesCommandHandler,
    name: string
}
type SlashCommandActionArgs = {
    client: Discord.Client,
    interaction: Interaction,
    sch: SlashCommandHandler,
    args: any
}

export class CombinedHandler {
    readonly client: Discord.Client
    readonly prefixHandler: PrefixCommandHandler
    readonly includesHandler: IncludesCommandHandler
    readonly slashHandler: SlashCommandHandler
    readonly admins: string[]

    public paused: boolean = false

    constructor(args: CombinedHandlerArgs) {
        this.client = args.client
        this.admins = args.admins ?? []
        this.prefixHandler = new PrefixCommandHandler(args.client, this, args.prefixCommandHandlerArgs)
        this.includesHandler = new IncludesCommandHandler(args.client, this, args.includesCommandHandlerArgs)
        this.slashHandler = new SlashCommandHandler(args.client, this, args.slashCommandHandlerArgs)
    }

}

export class PrefixCommandHandler {
    private commands: PrefixCommand[]
    private client: Discord.Client
    readonly prefix: string
    readonly handler: CombinedHandler

    constructor(client: Discord.Client, handler: CombinedHandler, { commands, prefix }: PrefixCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.prefix = prefix
        this.commands = commands

        client.on('message', message => {
            if (message.content.startsWith(this.prefix)) {
                this.handleMessage(message);
            }
        })
    }

    private handleMessage(message: Discord.Message) {
        this.commands.forEach(cmd => {
            var name = cmd.names.find(name => message.content.startsWith(`${this.prefix}${name}`))

            //name matches?
            if (name) {
                //command not paused?
                if (!this.handler.paused || cmd.bypassPause) {
                    //command can be executed by user/bot
                    if (!message.author.bot || cmd.botExecutable) {
                        //has perms?
                        if (!cmd.adminOnly || (message.member && this.handler.admins.includes(message.member.id))) {
                            var key = this.prefix + name
                            var searchArgs = message.content.substring(message.content.indexOf(key) + key.length).trim().split(' ').filter(str => str != "");
                            cmd.action({ client: this.client, message, pch: this, name: name, args: searchArgs })
                        } else {
                            message.channel.send("Insufficient permissions.")
                        }
                    }
                }
            }
        })
    }
}

export class IncludesCommandHandler {
    private commands: IncludesCommand[]
    private client: Discord.Client
    readonly handler: CombinedHandler

    constructor(client: Discord.Client, handler: CombinedHandler, { commands }: IncludesCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.commands = commands

        client.on('message', message => {
            this.handleMessage(message);
        })
    }
    private handleMessage(message: Discord.Message) {
        this.commands.forEach(cmd => {
            var name = cmd.names.find(name => message.content.toLowerCase().includes(name))
            //name matches?
            if (name) {
                //command not paused?
                if (!this.handler.paused || cmd.bypassPause) {
                    //command can be executed by user/bot
                    if (!message.author.bot || cmd.botExecutable) {
                        //has perms?
                        if (!cmd.adminOnly || (message.member && this.handler.admins.includes(message.member.id))) {
                            cmd.action({ client: this.client, message, ich: this, name })
                        } else {
                            message.channel.send("Insufficient permissions.")
                        }
                    }
                }
            }
        })
    }
}

export class SlashCommandHandler {
    private commands: SlashCommand[]
    private client: Discord.Client
    readonly handler: CombinedHandler

    constructor(client: Discord.Client, handler: CombinedHandler, { globalCommands, guildsCommands }: SlashCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.commands = []
        const register = async () => {
            console.log('Started registering guild slash commands')
            for (const guildCommands of guildsCommands) {
                this.commands = this.commands.concat(guildCommands.commands)
                await SlashUtils.registerGuildCommands(client, guildCommands.commands, guildCommands.guild_id)
            }
            console.log('Done registering guild slash commands')

            //@ts-ignore
            client.ws.on('INTERACTION_CREATE', interaction => {
                this.handleInteraction(interaction as Interaction);
            })
        }
        register()

    }



    private handleInteraction(interaction: Interaction) {
        console.log(interaction)
        this.commands.forEach(cmd => {
            //name matches?
            if (interaction?.data?.name == cmd.definition.name) {
                //command not paused?
                if (!this.handler.paused || cmd.bypassPause) {
                    //has perms?
                    if (!cmd.adminOnly || this.handler.admins.includes(interaction.member!.user.id)) {
                        var args: any = {}
                        if (interaction.data?.options) {
                            for (const option of interaction.data.options) {
                                args[option.name] = option.value
                            }
                        }
                        console.log(args);
                        
                        cmd.action({ client: this.client, interaction, sch: this, args })
                        /*SlashUtils.respondToInteraction(this.client, interaction, {
                            type: 4,
                            data: {
                                content: "||done||"
                            }
                        })*/
                    } else {
                        this.sendInsufftPerms(interaction)
                    }
                }
            }
        })
    }

    private sendInsufftPerms(interaction: Interaction) {
        var guild = this.client.guilds.cache.get(interaction.guild_id!)!
        var channelSentIn = guild.channels.cache.get(interaction.channel_id!)!
        if (channelSentIn instanceof Discord.TextChannel) {
            channelSentIn.send("Insufficient permissions.")
        }
    }
}


export abstract class Command {
    readonly adminOnly: boolean
    readonly bypassPause: boolean
    readonly botExecutable: boolean
    constructor({ adminOnly = false, botExecutable = false, bypassPause = false }: CommandArgs) {
        this.adminOnly = adminOnly;
        this.bypassPause = bypassPause;
        this.botExecutable = botExecutable;
    }
}

export class PrefixCommand extends Command {
    readonly names: string[]
    readonly action: (args: PrefixCommandActionArgs) => void

    constructor({ action, names, adminOnly, botExecutable, bypassPause }: PrefixCommandArgs) {
        super({ adminOnly, bypassPause, botExecutable })
        this.names = names;
        this.action = action;
    }
}

export class IncludesCommand extends Command {
    readonly names: string[]
    readonly action: (args: IncludesCommandActionArgs) => void

    constructor({ action, names, adminOnly, botExecutable, bypassPause }: IncludesCommandArgs) {
        super({ adminOnly, bypassPause, botExecutable })
        this.names = names;
        this.action = action;
    }
}

export class IncludesReactCommand extends IncludesCommand {
    constructor(args: IncludesReactCommandArgs) {
        super({
            names: args.names,
            action: ({ message }) => {
                message.react(args.emoji)
            },
            botExecutable: true
        })
    }
}

export class SlashCommand extends Command {
    readonly action: (args: SlashCommandActionArgs) => void
    readonly definition: Definition

    constructor({ action, definition, adminOnly, bypassPause }: SlashCommandArgs) {
        super({ adminOnly, bypassPause, botExecutable: false })
        this.action = action;
        this.definition = definition;
    }
}