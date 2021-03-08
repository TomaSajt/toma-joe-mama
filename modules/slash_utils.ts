
import { Definition, ApplicationCommand } from './discord_type_extension'
import * as config from '../config.json'
import { Client, Snowflake } from 'discord.js'
import fetch from 'node-fetch'
import { SlashCommand } from './commandutils'



var guild_id = config.guilds.nyf

export async function postCommand(client: Client, definition: Definition) {
    var url = 'https://discord.com/api/v8/applications'
    url += `/${client.user!.id}`
    url += '/guilds'
    url += `/${guild_id}`
    url += '/commands'
    var message = "Sending POST request to url " + url + "\n"
    var res = await fetch(url, {
        headers: {
            'Authorization': `Bot ${client.token}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(definition)
    })
    message += res.status + "\n"
    var json = await res.json()

    message += 'posted a new definition. response:\n' + JSON.stringify(json) + '\n'
    console.log(message)
}

export async function patchCommand(client: Client, definition: Definition, command_id: Snowflake) {
    var url = 'https://discord.com/api/v8/applications'
    url += `/${client.user!.id}`
    url += '/guilds'
    url += `/${guild_id}`
    url += '/commands'
    url += `/${command_id}`
    var message = "Sending PATCH request to url " + url + "\n"
    var res = await fetch(url, {
        headers: {
            'Authorization': `Bot ${client.token}`,
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(definition)
    })
    message += res.status + "\n"
    var json = await res.json()
    message += 'patched an existing definition. response:\n' + JSON.stringify(json) + '\n'
    console.log(message)
}

export async function deleteCommand(client: Client, command_id: Snowflake) {
    var url = 'https://discord.com/api/v8/applications'
    url += `/${client.user!.id}`
    url += '/guilds'
    url += `/${guild_id}`
    url += '/commands'
    url += `/${command_id}`
    var message = "Sending DELETE request to url " + url + "\n"
    var res = (await fetch(url, {
        headers: {
            'Authorization': `Bot ${client.token}`,
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: "false"
    }))
    message += res.status + "\n"
    await res.text()
    message += 'deleted a definition.\n'
    console.log(message)
}


export async function getCommands(client: Client) {
    var url = 'https://discord.com/api/v8/applications'
    url += `/${client.user!.id}`
    url += '/guilds'
    url += `/${guild_id}`
    url += '/commands'

    var res = await fetch(url, {
        headers: {
            'Authorization': `Bot ${client.token}`,
            method: 'GET'
        }
    })
    var json = await res.json()
    return json as ApplicationCommand[]
}

export async function registerCommands(client: Client, slashCommands: Iterable<SlashCommand>) {
    var commands = [...slashCommands]
    var prevCmds = await getCommands(client)
    var postCmds = new Set<SlashCommand>(commands)

    for (var prevCmd of prevCmds) {
        var foundCmd = commands.find(cmd => cmd.definition.name == prevCmd.name)
        if (foundCmd) {
            await patchCommand(client, foundCmd.definition, prevCmd.id)
            postCmds.delete(foundCmd)
        }
        else {
            await deleteCommand(client, prevCmd.id)
        }
    }
    for (var postCmd of postCmds) {
        await postCommand(client, postCmd.definition)
    }
}