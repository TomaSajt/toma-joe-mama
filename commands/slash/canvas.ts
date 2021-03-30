import { SlashCommand, SlashCommandActionArgs } from "../../modules/commandutils";
import { Canvas, createCanvas, Image, loadImage } from "canvas";
import { GuildMember, MessageAttachment } from "discord.js";

var canvasMap = new Map<GuildMember, Canvas>();

export default new SlashCommand({
    definition: {
        name: "canvas",
        description: "Commands connected to the personal canvas",
        options: [
            {
                name: "init",
                description: "Commands connected to creating a new canvas",
                type: 2, // 2 is type SUB_COMMAND_GROUP
                options: [
                    {
                        name: "color",
                        description: "Creates a new canvas with the given color as the background",
                        type: 1, // 1 is type SUB_COMMAND
                        options: [
                            {
                                name: "width",
                                description: "The width of the new canvas",
                                type: 4,
                                required: true
                            },
                            {
                                name: "height",
                                description: "The height of the new canvas",
                                type: 4,
                                required: true
                            },
                            {
                                name: "color",
                                description: "The background color of the new canvas",
                                type: 3,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "image",
                        description: "Creates a new canvas with the given image as the background",
                        type: 1,
                        options: [
                            {
                                name: "width",
                                description: "The width of the new canvas",
                                type: 4,
                                required: true
                            },
                            {
                                name: "height",
                                description: "The height of the new canvas",
                                type: 4,
                                required: true
                            },
                            {
                                name: "url",
                                description: "The image url for the background of the new canvas",
                                type: 3,
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                name: "draw",
                description: "Commands connected to drawing on the canvas",
                type: 2,
                options: [
                    {
                        name: "square",
                        description: "Draws a square",
                        type: 1,
                        options: [
                            {
                                name: "side",
                                description: "The side length of the square",
                                type: 4,
                                required: true
                            },
                            {
                                name: "x",
                                description: "The x coordinate for the top left corner of the square",
                                type: 4,
                                required: true
                            },
                            {
                                name: "y",
                                description: "The y coordinate for the top left corner of the square",
                                type: 4,
                                required: true
                            },
                            {
                                name: "color",
                                description: "The color of the square",
                                type: 3,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "rectangle",
                        description: "Draws a rectangle",
                        type: 1,
                        options: [
                            {
                                name: "width",
                                description: "The width of the rectangle",
                                type: 4,
                                required: true
                            },
                            {
                                name: "height",
                                description: "The height of the rectangle",
                                type: 4,
                                required: true
                            },
                            {
                                name: "x",
                                description: "The x coordinate for the top left corner of the square",
                                type: 4,
                                required: true
                            },
                            {
                                name: "y",
                                description: "The y coordinate for the top left corner of the square",
                                type: 4,
                                required: true
                            },
                            {
                                name: "color",
                                description: "The color of the square",
                                type: 3,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "circle",
                        description: "Edit permissions for a role",
                        type: 1,
                        options: [
                            {
                                name: "radius",
                                description: "The radius of the circle",
                                type: 4,
                                required: true
                            },
                            {
                                name: "x",
                                description: "The x coordinate for the origin of the circle",
                                type: 4,
                                required: true
                            },
                            {
                                name: "y",
                                description: "The y coordinate for the origin of the circle",
                                type: 4,
                                required: true
                            },
                            {
                                name: "color",
                                description: "The color of the circle",
                                type: 3,
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                name: "data",
                description: "Special commands connected to the canvas",
                type: 2,
                options: [
                    {
                        name: "delete",
                        description: "Deletes your canvas",
                        type: 1
                    }
                ]
            }
        ]
    },
    action: async (scargs) => {
        switch (scargs.subcommandgroup) {
            case 'init':
                await scg_init(scargs)
                break;
            case 'draw':
                await scg_draw(scargs)
                break;
            case 'data':
                await scg_data(scargs)
                break;
        }
    },
})


async function scg_init({ args, channel, member, subcommand }: SlashCommandActionArgs) {
    switch (subcommand) {
        case 'color':
            var canvas = createCanvas(args.width, args.height);
            var ctx = canvas.getContext('2d')
            ctx.save();
            ctx.fillStyle = args.color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            canvasMap.set(member, canvas);
            channel.send(new MessageAttachment(canvas.toBuffer()));
            break;

        case 'image':
            var canvas = createCanvas(args.width, args.height);
            var ctx = canvas.getContext('2d')
            ctx.drawImage(await loadImage(args.url), 0, 0, canvas.width, canvas.height)
            canvasMap.set(member, canvas);
            channel.send(new MessageAttachment(canvas.toBuffer()));
            break;

    }
}


async function scg_draw({ args, channel, member, subcommand }: SlashCommandActionArgs) {
    var canvas = canvasMap.get(member)
    if (!canvas) {
        channel.send(`${member}, you don't have a canvas yet`)
        return;
    }
    var ctx = canvas.getContext('2d')
    switch (subcommand) {
        case 'square':
            ctx.save();
            ctx.fillStyle = args.color;
            ctx.fillRect(args.x, args.y, args.side, args.side);
            ctx.restore();
            break;
        case 'rectangle':
            ctx.save();
            ctx.fillStyle = args.color;
            ctx.fillRect(args.x, args.y, args.width, args.height);
            ctx.restore();
            break;

        case 'circle':
            ctx.save();
            ctx.fillStyle = args.color;
            ctx.beginPath()
            ctx.arc(args.x, args.y, args.radius, 0, 2 * Math.PI)
            ctx.fill();
            ctx.restore();
            break;

    }
    channel.send(new MessageAttachment(canvas.toBuffer()));
}
async function scg_data({ args, channel, member, subcommand }: SlashCommandActionArgs) {
    var canvas = canvasMap.get(member)
    if (!canvas) {
        channel.send(`${member}, you don't have a canvas yet`)
        return;
    }
    switch (subcommand) {
        case 'delete':
            canvasMap.delete(member)
            channel.send(`${member}, your canvas was succesfully deleted`)
            break;
    }
}