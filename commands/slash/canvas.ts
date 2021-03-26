import { SlashCommand } from "../../modules/commandutils";

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
                                name: "image",
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
                                description: "The x coordinate for the bottom left corner of the square",
                                type: 4,
                                required: true
                            },
                            {
                                name: "y",
                                description: "The y coordinate for the bottom left corner of the square",
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
            }
        ]
    },
    action: ({ args, channel, interaction, subcommandgroup, subcommand }) => {
    },
})