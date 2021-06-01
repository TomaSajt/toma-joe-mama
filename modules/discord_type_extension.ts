import { Snowflake, GuildMember, User, MessageEmbed, Role, Channel } from "discord.js";

export type ApplicationCommand = {
  id: Snowflake;
  application_id: Snowflake;
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
};

export type Definition = {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
};

export type ApplicationCommandOption = {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: ApplicationCommandOption[];
};

export type ApplicationCommandOptionChoice = {
  name: string;
  value: string | number;
};

export type Interaction = {
  id: Snowflake;
  application_id: Snowflake;
  type: 1 | 2 | 3;
  data?: ApplicationCommandInteractionData;
  guild_id?: Snowflake;
  channel_id?: Snowflake;
  member?: GuildMember;
  user?: User;
  token: string;
  version: number;
};

export type ApplicationCommandInteractionData = {
  id: Snowflake
  name: string
  options?: ApplicationCommandInteractionDataOption[]
  custom_id: string
  component_type: string
};

export type ApplicationCommandInteractionDataResolved = {
  users?: Map<Snowflake, Partial<User>>
  members?: Map<Snowflake, Partial<GuildMember>>
  roles?: Map<Snowflake, Partial<Role>>
  channels?: Map<Snowflake, Partial<Channel>>
}
export type ApplicationCommandInteractionDataOption = {
  name: string;
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  value?: any;
  options?: ApplicationCommandInteractionDataOption[];
};

export type InteractionResponse = {
  type: 1 | 4 | 5 | 6 | 7;
  data?: InteractionApplicationCommandCallbackData;
};

export type InteractionApplicationCommandCallbackData = {
  tts?: boolean;
  content?: string;
  embeds?: MessageEmbed;
  allowed_mentions?: AllowedMentions;
  flags?: number;
  components?: Component[]
};

export type AllowedMentions = {
  parse: ("roles" | "users" | "everyone")[];
  roles: Snowflake[];
  users: Snowflake[];
  replied_user: boolean;
};

export type Component = {
  type: 1 | 2
  style?: number
  label?: string
  emoji?: { name?: string, id?: Snowflake, animated?: boolean }
  custom_id?: string
  url?: string
  disabled?: boolean
  components?: Component[]
}