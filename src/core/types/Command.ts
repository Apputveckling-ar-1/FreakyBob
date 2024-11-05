import type {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from "discord.js";
import type FreakyBob from "../FreakyBob";

export interface RunOptions {
  client: FreakyBob;
  ctx: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export type RunFn = (options: RunOptions) => any;

export type Command = {
  userPerms?: PermissionResolvable[];
  run: RunFn;
} & ChatInputApplicationCommandData;
