import Discord, { TextChannel } from 'discord.js'
import { Interaction, Definition } from './discord_type_extension'
import * as SlashUtils from './slash_utils'

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
    name: string
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
    sch: SlashCommandHandler
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

    constructor(client: Discord.Client, handler: ComplexHandler, { commands, prefix }: PrefixCommandHandlerArgs) {
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

            var flag1 = !cmd.adminOnly || (message.member && this.handler.admins.includes(message.member.id))

            var flag2 = !this.handler.paused || cmd.bypassPause

            var flag3 = !message.author.bot || cmd.botExecutable

            if (name !== undefined && flag1 && flag2 && flag3) {
                cmd.action({ client: this.client, message, pch: this, name: name })
            }
            if (name !== undefined && flag2 && !flag1) {
                message.channel.send("Insufficient permissions.")
            }
        })
    }
}

export class IncludesCommandHandler {
    private commands: IncludesCommand[]
    private client: Discord.Client
    readonly handler: ComplexHandler

    constructor(client: Discord.Client, handler: ComplexHandler, { commands }: IncludesCommandHandlerArgs) {
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

            var flag1 = !cmd.adminOnly || (message.member && this.handler.admins.includes(message.member.id))

            var flag2 = !this.handler.paused || cmd.bypassPause

            var flag3 = !message.author.bot || cmd.botExecutable

            if (name !== undefined && flag1 && flag2 && flag3) {
                cmd.action({ client: this.client, message, ich: this, name })
            }
            if (name !== undefined && flag2 && !flag1) {
                message.channel.send("Insufficient permissions.")
            }
        })
    }
}

export class SlashCommandHandler {
    private commands: SlashCommand[]
    private client: Discord.Client
    readonly handler: ComplexHandler

    constructor(client: Discord.Client, handler: ComplexHandler, { commands }: SlashCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.commands = commands
        const register = async () => {
            console.log('Started registering slash commands')
            await SlashUtils.registerCommands(client, this.commands)
            console.log('Done registering slash commands')

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
            var flag1 = interaction?.data?.name == cmd.definition.name

            var flag2 = !cmd.adminOnly || this.handler.admins.includes(interaction.member!.user.id)

            var flag3 = !this.handler.paused || cmd.bypassPause


            if (flag1 && flag2 && flag3) {
                cmd.action({ client: this.client, interaction, sch: this })
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


export abstract class Command {
    readonly adminOnly: boolean
    readonly bypassPause: boolean
    readonly botExecutable: boolean
    constructor({ adminOnly, botExecutable, bypassPause }: CommandArgs) {
        this.adminOnly = adminOnly ?? false;
        this.bypassPause = bypassPause ?? false;
        this.botExecutable = botExecutable ?? false
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