import { Snowflake, GuildMember, User, MessageEmbed } from "discord.js";

export type ApplicationCommand = {
    id: Snowflake,
    application_id: Snowflake
    name: string,
    description: string
    options?: ApplicationCommandOption[]
}

export type Definition = {
    name: string,
    description: string
    options?: ApplicationCommandOption[]
}

export type ApplicationCommandOption = {
    type: number,
    name: string,
    description: string,
    required?: boolean,
    choices?: ApplicationCommandOptionChoice[],
    options?: ApplicationCommandOption[]
}

export type ApplicationCommandOptionChoice = {
    name: string,
    value: string | number
}

export type Interaction = {
    id: Snowflake,
    type: 1 | 2,
    data?: ApplicationCommandInteractionData,
    guild_id?: Snowflake,
    channel_id?: Snowflake,
    member?: GuildMember,
    user?: User,
    token: string,
    version: number
}
export type ApplicationCommandInteractionData = {
    id: Snowflake,
    name: string,
    options?: ApplicationCommandInteractionDataOption[]
}

export type ApplicationCommandInteractionDataOption = {
    name: string,
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    value?: any,
    options?: ApplicationCommandInteractionDataOption[]
}

export type InteractionResponse = {
    type: 1 | 2 | 3 | 4 | 5,
    data?: InteractionApplicationCommandCallbackData
}
export type InteractionApplicationCommandCallbackData = {
    tts?: boolean,
    content?: string,
    embeds?: MessageEmbed,
    allowed_mentions?: AllowedMentions
    flags?: number
}

export type AllowedMentions = {
    parse: ("roles" | "users" | "everyone")[]
    roles: Snowflake[]
    users: Snowflake[]
    replied_user: boolean
}