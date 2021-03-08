import { Snowflake, GuildMember, User } from "discord.js";

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

export type OptionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type ApplicationCommandOptionChoice = {
    name: string,
    value: string | number
}

export type Interaction = {
    id: Snowflake,
    type: InteractionType,
    data?: ApplicationCommandInteractionData,
    guild_id?: Snowflake,
    channel_id?: Snowflake,
    member?: GuildMember,
    user?: User,
    token: string,
    version: number
}

export type InteractionType = 1 | 2

export type ApplicationCommandInteractionData = {
    id: Snowflake,
    name: string,
    options?: ApplicationCommandInteractionDataOption[]
}

export type ApplicationCommandInteractionDataOption = {
    name: string,
    type: OptionType
    value?: any,
    options?: ApplicationCommandInteractionDataOption[]
}