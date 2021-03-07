import { PrefixCommand } from "../../modules/commandutils";

export const test = new PrefixCommand({
    names: ['test'],
    action: (client, message) => { message.channel.send('test message') }
});

export const ping = new PrefixCommand({
    names: ['ping', 'ping-me', 'ping-pong'],
    action: (client, message) => { message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`); }
});