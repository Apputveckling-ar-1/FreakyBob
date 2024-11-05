import { ApplicationCommandOptionType } from "discord.js";
import type { Command } from "../../core/types/Command";

// Static choices for now
const commands = ["freaky", "touch"];

export default {
  name: "manage",
  description: "manage commands",
  devOnly: true,
  options: [
    {
      name: "disable",
      description: "disable that command",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "cmd_name",
          description: "command name",
          required: true,
          type: ApplicationCommandOptionType.String,
          choices: commands.map((z) => ({
            name: z,
            value: z.toLowerCase(),
          })),
        },
      ],
    },
    {
      name: "enable",
      description: "enable that command",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "cmd_name",
          description: "command name",
          required: true,
          type: ApplicationCommandOptionType.String,
          choices: commands.map((z) => ({
            name: z,
            value: z.toLowerCase(),
          })),
        },
      ],
    },
  ],
  run: ({ args, client, ctx }) => {
    const commandName = args.getString("cmd_name") as string;
    const subCommand = args.getSubcommand() as string;
    const containsCommands = (cmdName: string) =>
      client.disabledCommands.filter(
        (f) => f.toLowerCase() === commandName?.toLowerCase()
      ).length > 0
        ? true
        : false;

    switch (subCommand.toLowerCase()) {
      case "enable":
        if (containsCommands(commandName)) {
          client.disabledCommands = client.disabledCommands.filter(
            (f) => f.toLowerCase() !== commandName.toLowerCase()
          );
          return ctx.reply({
            content: `Command enabled: ${commandName}`,
          });
        }
        return ctx.reply({ content: "Command is not disabled bro" });
      case "disable":
        if (containsCommands(commandName)) {
          return ctx.reply({ content: "Command is already disabled bro" });
        }

        client.disabledCommands.push(commandName.toLowerCase());
        return ctx.reply({ content: `Command disabled: ${commandName}` });
      default:
        return ctx.reply({ content: "Pick an option bruh", ephemeral: true });
    }
  },
} as Command;
