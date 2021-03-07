import { PrefixCommand } from "../../modules/commandutils";

export const pause = new PrefixCommand({
    names: ['pause'],
    bypassPause: true,
    adminOnly: true,
    action: (client, message, pch) => {
        if (!pch.handler.paused) {
            pch.handler.paused = true;
            message.channel.send('Paused the handler.')
        }
    }
});

export const unpause = new PrefixCommand({
    names: ['unpause', 'resume'],
    bypassPause: true,
    adminOnly: true,
    action: (client, message, pch) => {
        if (pch.handler.paused) {
            pch.handler.paused = false;
            message.channel.send('Unpaused the handler.')
        }
    }
});