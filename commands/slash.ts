import { TextChannel } from "discord.js";
import { cwd } from "process";
import { SlashCommand } from "../modules/commandutils";
var gTTS = require('gtts')
var filename = 'tts.mp3'

export const cmds = [
    new SlashCommand({

        definition: {
            name: 'remote',
            description: 'Sends a given message to the given channel',
            options: [
                {
                    name: "channel",
                    description: "Channel to send message to",
                    type: 7,
                    required: true
                },
                {
                    name: "message",
                    description: "The message to send",
                    type: 3,
                    required: true
                }
            ]

        },
        action: ({ client, interaction }) => {
            var guild = client.guilds.cache.get(interaction.guild_id!)!
            var channelToSend = guild.channels.cache.get(interaction.data!.options![0].value!)!;
            var channelSentIn = guild.channels.cache.get(interaction.channel_id!)!;
            if (channelToSend instanceof TextChannel) {
                channelToSend.send(interaction.data!.options![1].value)
            }

        }
    }),
    new SlashCommand({

        definition: {
            name: 'tag',
            description: 'Tags a person',
            options: [
                {
                    name: "member",
                    description: "Who to tag",
                    type: 6,
                    required: true
                }
            ]
        },
        action: ({ client, interaction }) => {
            var guild = client.guilds.cache.get(interaction.guild_id!)!
            var channel = guild.channels.cache.get(interaction.channel_id!)!
            if (channel instanceof TextChannel) {
                channel.send(`Hello <@${interaction.data!.options![0].value}>`)
            }

        }

    }),
    new SlashCommand({
        adminOnly: true,
        definition: {
            name: 'as',
            description: 'Sends a message in the name of a persom',
            options: [
                {
                    name: "member",
                    description: "Who to impersonate as",
                    type: 6,
                    required: true
                },
                {
                    name: "message",
                    description: "The message to send",
                    type: 3,
                    required: true
                },
                {
                    name: "channel",
                    description: "The channel to send the message in",
                    type: 7,
                    required: false
                }
            ]
        },
        action: ({ client, interaction }) => {
            console.log('as command')
            var guild = client.guilds.cache.get(interaction.guild_id!)
            if (guild) {
                if (interaction.data!.options![2]) {
                    var channel = guild.channels.cache.get(interaction.data!.options![2].value)
                } else {
                    var channel = guild.channels.cache.get(interaction.channel_id!)
                }
                if (channel instanceof TextChannel) {
                    channel.send(interaction.data!.options![1].value)
                }
            }

        }

    }),
    new SlashCommand({

        definition: {
            name: 'tts',
            description: "Send a TTS mp3 to the channel",
            options: [
                {
                    name: "text",
                    description: "Text to speak",
                    type: 3, //string
                    required: true
                },
                {
                    name: "language",
                    description: "Text to speak",
                    type: 3,
                    required: true,
                    choices: [
                        //{ name: "Afrikaans", value: "af" },
                        //{ name: "Irish", value: "ga" },
                        //{ name: "Albanian", value: "sq" },
                        { name: "Italian", value: "it" },
                        //{ name: "Arabic", value: "ar" },
                        //{ name: "Japanese", value: "ja" },
                        //{ name: "Azerbaijani", value: "az" },
                        //{ name: "Kannada", value: "kn" },
                        //{ name: "Basque", value: "eu" },
                        //{ name: "Korean", value: "ko" },
                        //{ name: "Bengali", value: "bn" },
                        //{ name: "Latin", value: "la" },
                        //{ name: "Belarusian", value: "be" },
                        //{ name: "Latvian", value: "lv" },
                        //{ name: "Bulgarian", value: "bg" },
                        //{ name: "Lithuanian", value: "lt" },
                        //{ name: "Catalan", value: "ca" },
                        //{ name: "Macedonian", value: "mk" },
                        //{ name: "Chinese Simplified", value: "zh-CN" },
                        //{ name: "Malay", value: "ms" },
                        //{ name: "Chinese Traditional", value: "zh-TW" },
                        //{ name: "Maltese", value: "mt" },
                        //{ name: "Croatian", value: "hr" },
                        //{ name: "Norwegian", value: "no" },
                        //{ name: "Czech", value: "cs" },
                        //{ name: "Persian", value: "fa" },
                        //{ name: "Danish", value: "da" },
                        //{ name: "Polish", value: "pl" },
                        //{ name: "Dutch", value: "nl" },
                        //{ name: "Portuguese", value: "pt" },
                        { name: "English", value: "en" },
                        //{ name: "Romanian", value: "ro" },
                        { name: "Esperanto", value: "eo" },
                        //{ name: "Russian", value: "ru" },
                        //{ name: "Estonian", value: "et" },
                        //{ name: "Serbian", value: "sr" },
                        //{ name: "Filipino", value: "tl" },
                        //{ name: "Slovak", value: "sk" },
                        //{ name: "Finnish", value: "fi" },
                        //{ name: "Slovenian", value: "sl" },
                        { name: "French", value: "fr" },
                        { name: "Spanish", value: "es" },
                        //{ name: "Galician", value: "gl" },
                        //{ name: "Swahili", value: "sw" },
                        //{ name: "Georgian", value: "ka" },
                        //{ name: "Swedish", value: "sv" },
                        { name: "German", value: "de" },
                        //{ name: "Tamil", value: "ta" },
                        //{ name: "Greek", value: "el" },
                        //{ name: "Telugu", value: "te" },
                        //{ name: "Gujarati", value: "gu" },
                        //{ name: "Thai", value: "th" },
                        //{ name: "Haitian Creole", value: "ht" },
                        //{ name: "Turkish", value: "tr" },
                        //{ name: "Hebrew", value: "iw" },
                        //{ name: "Ukrainian", value: "uk" },
                        //{ name: "Hindi", value: "hi" },
                        //{ name: "Urdu", value: "ur" },
                        { name: "Hungarian", value: "hu" },
                        //{ name: "Vietnamese", value: "vi" },
                        //{ name: "Icelandic", value: "is" },
                        //{ name: "Welsh", value: "cy" },
                        //{ name: "Indonesian", value: "id" },
                        //{ name: "Yiddish", value: "yi" }
                    ]
                }
            ]
        },
        action: ({ client, interaction }) => {
            var guild = client.guilds.cache.get(interaction.guild_id!)!
            var channel = guild.channels.cache.get(interaction.channel_id!)

            var gtts = new gTTS(interaction.data!.options![0].value, interaction.data!.options![1].value);
            gtts.save(filename, function (err: string | undefined, result: any) {
                if (err) { throw new Error(err); }
                console.log("Text to speech converted!");
                if (channel instanceof TextChannel) {
                    channel.send({
                        files: [filename]
                    })
                }
            })
        }
    })
]