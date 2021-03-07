import Discord, { EmojiIdentifierResolvable } from 'discord.js'

type HandlerArgs = {
    client: Discord.Client,
    admins?: string[],
    pchArgs: PrefixCommandHandlerArgs
    ichArgs: IncludesCommandHandlerArgs
}
type PrefixCommandHandlerArgs = {
    prefix: string,
    commands: PrefixCommand[]
}
type IncludesCommandHandlerArgs = {
    commands: IncludesCommand[]
}

type CommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean
}

type PrefixCommandArgs = CommandArgs & {
    names: string[],
    action: (client: Discord.Client, message: Discord.Message, prefixCommandHandler: PrefixCommandHandler) => void
}
type IncludesCommandArgs = CommandArgs & {
    names: string[],
    action: (client: Discord.Client, message: Discord.Message, prefixCommandHandler: IncludesCommandHandler) => void
}

type ReactCommandArgs = {
    names: string[],
    emoji: EmojiIdentifierResolvable
}

export class Handler {
    readonly client: Discord.Client
    readonly prefixHandler: PrefixCommandHandler
    readonly includesHandler: IncludesCommandHandler
    readonly admins: string[]

    public paused: boolean = false

    constructor(args: HandlerArgs) {
        this.client = args.client
        this.admins = args.admins ?? []
        this.prefixHandler = new PrefixCommandHandler(args.client, this, args.pchArgs)
        this.includesHandler = new IncludesCommandHandler(args.client, this, args.ichArgs)
    }

}

export class PrefixCommandHandler {
    private commands: PrefixCommand[]
    private client: Discord.Client
    readonly prefix: string
    readonly handler: Handler

    constructor(client: Discord.Client, handler: Handler, args: PrefixCommandHandlerArgs) {
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
    readonly handler: Handler

    constructor(client: Discord.Client, handler: Handler, args: IncludesCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.commands = args.commands

        client.on('message', message => {
            this.handleMessage(message);
        })
    }
    private handleMessage(message: Discord.Message) {
        this.commands.forEach(cmd => {
            var flag1 = cmd.names.some(name => message.content.includes(name))

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
    readonly action: (client: Discord.Client, message: Discord.Message, prefixCommandHandler: IncludesCommandHandler) => void
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


export class ReactCommand extends IncludesCommand {
    constructor(args: ReactCommandArgs) {
        super({
            names: args.names,
            action: (client, message) => {
                message.react(args.emoji)
            },
            botExecutable: true
        })
    }
}