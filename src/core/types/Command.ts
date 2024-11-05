import type {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
} from "discord.js";
import type FreakyBob from "../FreakyBob";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

export interface RunOptions {
  client: FreakyBob;
  ctx: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

export type RunFn = (options: RunOptions) => any;

export type Command = {
  userPerms?: PermissionResolvable[];
  run: RunFn;
  devOnly?: boolean;
  ownerOnly?: boolean;
} & ChatInputApplicationCommandData;
