import Discord, { APIMessage, Client, Guild, GuildChannel, GuildMember, Snowflake, TextChannel } from 'discord.js'
import { Interaction, Definition, InteractionResponse, ApplicationCommandInteractionDataOption, ApplicationCommandInteractionData } from './discord_type_extension'
import * as SlashUtils from './slash_utils'
import colors from 'colors'
import fs from "fs";
import path from "path";
import { respondToInteraction } from './interaction_utils';
colors.enable();

export type CombinedHandlerArgs = {
    client: Discord.Client,
    admins?: string[],
    prefixCommandHandlerArgs: PrefixCommandHandlerArgs
    includesCommandHandlerArgs: IncludesCommandHandlerArgs
    slashCommandHandlerArgs: SlashCommandHandlerArgs
}
export type PrefixCommandHandlerArgs = {
    prefix: string,
    commands: PrefixCommand[]
}
export type IncludesCommandHandlerArgs = {
    commands: IncludesCommand[]
}
export type SlashCommandHandlerArgs = {
    globalCommands: SlashCommand[]
    guildsCommands: {
        guild_id: Snowflake
        commands: SlashCommand[]
    }[]
}

export type CommandArgs = {
    adminOnly?: boolean,
    bypassPause?: boolean,
    botExecutable?: boolean,
    hidden?: boolean
}
export type PrefixCommandArgs = CommandArgs & {
    names: string[],
    description?: string,
    action: (args: PrefixCommandActionArgs) => void
}
export type IncludesCommandArgs = CommandArgs & {
    names: string[],
    action: (args: IncludesCommandActionArgs) => void
}
export type IncludesReactCommandArgs = {
    names: string[],
    emoji: Discord.EmojiIdentifierResolvable
}
export type SlashCommandArgs = CommandArgs & {
    definition: Definition,
    action: (args: SlashCommandActionArgs) => Promise<InteractionResponse | void>
}

export type PrefixCommandActionArgs = {
    client: Discord.Client,
    message: Discord.Message,
    pch: PrefixCommandHandler,
    name: string,
    args: string[]
}
export type IncludesCommandActionArgs = {
    client: Discord.Client,
    message: Discord.Message,
    ich: IncludesCommandHandler,
    name: string
}
export type SlashCommandActionArgs = {
    client: Discord.Client,
    interaction: Interaction,
    sch: SlashCommandHandler,
    args: any,
    guild: Guild,
    channel: TextChannel,
    member: GuildMember,
    subcommand?: string,
    subcommandgroup?: string
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
    readonly commands: PrefixCommand[]
    readonly client: Discord.Client
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
            if (!name) return;
            //command not paused?
            if (this.handler.paused && !cmd.bypassPause) return;
            //command can be executed by user/bot
            if (message.author.bot && !cmd.botExecutable) return;
            //has perms?
            if (cmd.adminOnly && !(message.member && this.handler.admins.includes(message.member.id))) {
                message.channel.send("Insufficient permissions.")
                return;
            }
            var key = this.prefix + name
            var args = message.content.substring(message.content.indexOf(key) + key.length).trim().split(' ').filter(str => str != "");
            cmd.action({ client: this.client, message, pch: this, name: name, args })



        })
    }
}

export class IncludesCommandHandler {
    readonly commands: IncludesCommand[]
    readonly client: Discord.Client
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
            if (!name) return;
            //command not paused?
            if (this.handler.paused && !cmd.bypassPause) return;
            //command can be executed by user/bot
            if (message.author.bot && !cmd.botExecutable) return;
            //has perms?
            if (cmd.adminOnly && !(message.member && this.handler.admins.includes(message.member.id))) {
                message.channel.send("Insufficient permissions.")
                return;
            }

            cmd.action({ client: this.client, message, ich: this, name })

        })
    }
}

export class SlashCommandHandler {
    readonly commands: SlashCommand[]
    readonly client: Discord.Client
    readonly handler: CombinedHandler

    constructor(client: Discord.Client, handler: CombinedHandler, { globalCommands, guildsCommands }: SlashCommandHandlerArgs) {
        this.client = client
        this.handler = handler
        this.commands = []
        for (const guildCommands of guildsCommands) {
            this.commands = this.commands.concat(guildCommands.commands)
        }
        const register = async () => {
            console.log('Started registering guild slash commands')
            for (const guildCommands of guildsCommands) {
                await SlashUtils.registerGuildCommands(client, guildCommands.commands, guildCommands.guild_id)
            }
            console.log('Done registering guild slash commands')
        }
        register()

        //@ts-ignore
        client.ws.on('INTERACTION_CREATE', (interaction: Interaction) => {
            if (interaction.type == 2) this.handleSlashCommand(interaction);
        })

    }



    private handleSlashCommand(interaction: Interaction) {
        console.log('got interaction')
        console.log(interaction)
        //console.log(interaction)
        this.commands.forEach(async cmd => {
            //name matches?
            if (interaction?.data?.name != cmd.definition.name) return;
            //command not paused?
            if (this.handler.paused && !cmd.bypassPause) return;
            //has perms?
            if (cmd.adminOnly && !this.handler.admins.includes(interaction.member!.user.id)) {
                this.sendInsufftPerms(interaction)
                return;
            }


            var args: any = {}
            var argsOptions: ApplicationCommandInteractionDataOption[] | undefined
            var subcommand: string | undefined
            var subcommandgroup: string | undefined
            if (interaction.data.options) {
                switch (interaction.data.options[0].type) {
                    case 2:
                        if (interaction.data.options[0].options) {
                            if (interaction.data.options[0].options[0].options) {
                                argsOptions = interaction.data.options[0].options[0].options
                            }
                            subcommand = interaction.data.options[0].options[0].name
                        }
                        subcommandgroup = interaction.data.options[0].name
                        break;
                    case 1:
                        if (interaction.data.options[0].options) {
                            argsOptions = interaction.data.options[0].options
                        }
                        subcommand = interaction.data.options[0].name
                        break;
                    default:
                        argsOptions = interaction.data.options
                        break;
                }
            }

            if (argsOptions) {
                for (const option of argsOptions) {
                    args[option.name] = option.value
                }
            }
            console.log(`${interaction?.data?.name} ${subcommandgroup} ${subcommand}`.yellow)
            console.log(args);
            var guild = this.client.guilds.cache.get(interaction.guild_id!)!
            var channel = guild.channels.cache.get(interaction.channel_id!)!
            var member = await guild.members.fetch(interaction.member?.user.id!)!
            var defaultData: InteractionResponse = {
                type: 4,
                data: {
                    content: "k"
                }
            }
            if (channel instanceof TextChannel) {

                var response = (await cmd.action({ client: this.client, interaction, sch: this, args, guild, channel, member, subcommand, subcommandgroup }) ?? defaultData) as InteractionResponse
                respondToInteraction(this.client, interaction, response)
            } else {
                respondToInteraction(this.client, interaction, defaultData)
            }



        })
    }

    private sendInsufftPerms(interaction: Interaction) {
        var guild = this.client.guilds.cache.get(interaction.guild_id!)!
        var channel = guild.channels.cache.get(interaction.channel_id!)!
        if (channel instanceof Discord.TextChannel) {
            channel.send("Insufficient permissions.")
        }
    }
}


export abstract class Command {
    readonly adminOnly: boolean
    readonly bypassPause: boolean
    readonly botExecutable: boolean
    readonly hidden?: boolean

    constructor({ adminOnly = false, botExecutable = false, bypassPause = false, hidden = false }: CommandArgs) {
        this.adminOnly = adminOnly;
        this.bypassPause = bypassPause;
        this.botExecutable = botExecutable;
        this.hidden = hidden
    }
}

export class PrefixCommand extends Command {
    readonly names: string[]
    readonly description?: string
    readonly action: (args: PrefixCommandActionArgs) => void

    constructor({ action, names, adminOnly, botExecutable, bypassPause, description, hidden }: PrefixCommandArgs) {
        super({ adminOnly, bypassPause, botExecutable, hidden })
        this.names = names;
        this.description = description
        this.action = action;
    }
}

export class IncludesCommand extends Command {
    readonly names: string[]
    readonly action: (args: IncludesCommandActionArgs) => void

    constructor({ action, names, adminOnly, botExecutable, bypassPause, hidden }: IncludesCommandArgs) {
        super({ adminOnly, bypassPause, botExecutable, hidden })
        this.names = names;
        this.action = action;
    }
}

export class IncludesReactCommand extends IncludesCommand {
    constructor({ names, emoji }: IncludesReactCommandArgs) {
        super({
            names,
            action: ({ message }) => {
                message.react(emoji)
            },
            botExecutable: true
        })
    }
}

export class SlashCommand extends Command {
    readonly action: (args: SlashCommandActionArgs) => Promise<InteractionResponse | void>
    readonly definition: Definition

    constructor({ action, definition, adminOnly, bypassPause, botExecutable, hidden }: SlashCommandArgs) {
        super({ adminOnly, bypassPause, botExecutable, hidden })
        this.action = action;
        this.definition = definition;
    }
}

export class CommandLoader<T extends Command> {
    dir: string;
    constructor(dir: string) {
        this.dir = dir
    }
    loadCommands(): Promise<T[]> {
        return Promise.all(
            fs
                .readdirSync(`${this.dir}`).filter(file => file.endsWith('.ts'))
                .map(
                    async (file) => {
                        var cmd = (await import(`../${this.dir}/${file}`)).default as T
                        console.log(`Loaded command: ${this.dir}/${file}`)
                        return cmd
                    }
                )
        );

    }
}