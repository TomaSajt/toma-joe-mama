import Discord from 'discord.js'

export class Command {
    readonly adminOnly?: boolean
    readonly bypassPause?: boolean
    readonly names: string[]
    readonly action: (client: Discord.Client, message: Discord.Message) => void
    constructor({
        adminOnly = false,
        bypassPause = false,
        names = [],
        action
    }: {
        adminOnly?: boolean,
        bypassPause?: boolean,
        names: string[],
        action: (client: Discord.Client, message: Discord.Message) => void
    }) {
        this.adminOnly = adminOnly;
        this.bypassPause = bypassPause;
        this.names = names;
        this.action = action;
    }
}


export class Handler {
    readonly commands: Command[] = []
    paused: boolean = false
    readonly client: Discord.Client
    readonly prefix: string

    constructor({ client, prefix = '!' }: { client: Discord.Client, prefix?: string }) {
        this.client = client
        this.prefix = prefix


        client.on('message', message => {
            if (message.content.startsWith(this.prefix)) {
                this.handleMessage(message)
            }
        })
    }


    private handleMessage(message: Discord.Message) {
        this.commands.forEach(cmd => {
            this.handleCommand(cmd, message)
        })
    }
    private handleCommand(cmd: Command, message: Discord.Message) {
        var nameFound = Any(cmd.names, name => message.content.startsWith(`${this.prefix}${name}`));
        if (nameFound && (cmd.bypassPause || !this.paused)) {
            cmd.action(this.client, message)
        }
    }
    private log(message: any) {
        console.log(`${this.prefix} => ${message}`)
    }

    registerCommand(cmd: Command) {
        this.commands.push(cmd)
    }

}
function Any<T>(arr: T[], func: (arg: T) => boolean): boolean {
    for (var i = 0; i < arr.length; i++) {
        if (func(arr[i])) return true
    }
    return false
}