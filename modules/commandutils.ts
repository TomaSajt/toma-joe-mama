import Discord, { TextChannel } from 'discord.js'
import {Interaction} from './discord_type_extension'
import * as config from '../config.json'

type ComplexHandlerArgs = {
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
    commands: SlashCommand[]
}

type CommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean
}

type PrefixCommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean,
    names: string[],
    action: (client: Discord.Client, message: Discord.Message, prefixCommandHandler: PrefixCommandHandler) => void
}
type IncludesCommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean,
    names: string[],
    action: (client: Discord.Client, message: Discord.Message, includesCommandHandler: IncludesCommandHandler) => void
}
type IncludesReactCommandArgs = {
    names: string[],
    emoji: Discord.EmojiIdentifierResolvable
}
type SlashCommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    definition: any,
    action: (client: Discord.Client, interaction: Interaction, slashCommandHandler: SlashCommandHandler) => void
}

export class ComplexHandler {
    readonly client: Discord.Client
    readonly prefixHandler: PrefixCommandHandler
    readonly includesHandler: IncludesCommandHandler
    readonly slashHandler: SlashCommandHandler
    readonly admins: string[]

    public paused: boolean = false

    constructor(args: ComplexHandlerArgs) {
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
    readonly handler: ComplexHandler

    constructor(client: Discord.Client, handler: ComplexHandler, args: PrefixCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.prefix = args.prefix
        this.commands = args.commands

        client.on('message', message => {
            if (message.content.startsWith(this.prefix)) {
                this.handleMessage(message);
            }
        })
    }

    private handleMessage(message: Discord.Message) {
        this.commands.forEach(cmd => {
            var flag1 = cmd.names.some(name => message.content.startsWith(`${this.prefix}${name}`))

            var flag2 = !cmd.adminOnly || (message.member && this.handler.admins.includes(message.member.id))

            var flag3 = !this.handler.paused || cmd.bypassPause

            var flag4 = !message.author.bot || cmd.botExecutable

            if (flag1 && flag2 && flag3 && flag4) {
                cmd.action(this.client, message, this)
            }
            if (flag3 && !flag2) {
                message.channel.send("Insufficient permissions.")
            }
        })
    }
}

export class IncludesCommandHandler {
    private commands: IncludesCommand[]
    private client: Discord.Client
    readonly handler: ComplexHandler

    constructor(client: Discord.Client, handler: ComplexHandler, args: IncludesCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.commands = args.commands

        client.on('message', message => {
            this.handleMessage(message);
        })
    }
    private handleMessage(message: Discord.Message) {
        this.commands.forEach(cmd => {
            var flag1 = cmd.names.some(name => message.content.toLowerCase().includes(name))

            var flag2 = !cmd.adminOnly || (message.member && this.handler.admins.includes(message.member.id))

            var flag3 = !this.handler.paused || cmd.bypassPause

            var flag4 = !message.author.bot || cmd.botExecutable

            if (flag1 && flag2 && flag3 && flag4) {
                cmd.action(this.client, message, this)
            }
            if (flag3 && !flag2) {
                message.channel.send("Insufficient permissions.")
            }
        })
    }
}

export class SlashCommandHandler {
    private commands: SlashCommand[]
    private client: Discord.Client
    readonly handler: ComplexHandler

    constructor(client: Discord.Client, handler: ComplexHandler, args: SlashCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.commands = args.commands

        //@ts-ignore
        this.commands.forEach(cmd => client.api.applications(client.user?.id).guilds(config.guilds.nyf).commands.post(cmd.definition))
        //@ts-ignore
        client.ws.on('INTERACTION_CREATE', interaction => {
            this.handleInteraction(interaction as Interaction);
        })
    }
    private handleInteraction(interaction: Interaction) {
        console.log(interaction)
        this.commands.forEach(cmd => {
            var flag1 = interaction?.data?.name == cmd.definition.data.name

            var flag2 = !cmd.adminOnly || this.handler.admins.includes(interaction.member!.user.id)

            var flag3 = !this.handler.paused || cmd.bypassPause


            if (flag1 && flag2 && flag3) {
                cmd.action(this.client, interaction, this)
            }
            if (flag3 && !flag2) {
                var guild = this.client.guilds.cache.get(interaction.guild_id!)!
                var channelSentIn = guild.channels.cache.get(interaction.channel_id!)!
                if (channelSentIn instanceof Discord.TextChannel) {
                    channelSentIn.send("Insufficient permissions.")
                }
            }
        })
    }
}













export interface Command {
    adminOnly: boolean
    bypassPause: boolean
    botExecutable: boolean
}

export class PrefixCommand implements Command {
    readonly names: string[]
    readonly action: (client: Discord.Client, message: Discord.Message, prefixCommandHandler: PrefixCommandHandler) => void
    adminOnly: boolean
    bypassPause: boolean
    botExecutable: boolean

    constructor(args: PrefixCommandArgs) {
        this.adminOnly = args.adminOnly ?? false;
        this.bypassPause = args.bypassPause ?? false;
        this.botExecutable = args.botExecutable ?? false
        this.names = args.names;
        this.action = args.action;
    }
}


export class IncludesCommand implements Command {
    readonly names: string[]
    readonly action: (client: Discord.Client, message: Discord.Message, includesCommandHandler: IncludesCommandHandler) => void
    adminOnly: boolean
    bypassPause: boolean
    botExecutable: boolean

    constructor(args: IncludesCommandArgs) {
        this.adminOnly = args.adminOnly ?? false;
        this.bypassPause = args.bypassPause ?? false;
        this.botExecutable = args.botExecutable ?? false
        this.names = args.names;
        this.action = args.action;
    }
}


export class IncludesReactCommand extends IncludesCommand {
    constructor(args: IncludesReactCommandArgs) {
        super({
            names: args.names,
            action: (client, message) => {
                message.react(args.emoji)
            },
            botExecutable: true
        })
    }
}

export class SlashCommand implements Command {
    readonly action: (client: Discord.Client, interaction: Interaction, slashCommandHandler: SlashCommandHandler) => void
    readonly definition: any
    adminOnly: boolean
    bypassPause: boolean
    botExecutable: boolean

    constructor(args: SlashCommandArgs) {
        this.adminOnly = args.adminOnly ?? false;
        this.bypassPause = args.bypassPause ?? false;
        this.botExecutable = false
        this.action = args.action;
        this.definition = args.definition;
    }
}