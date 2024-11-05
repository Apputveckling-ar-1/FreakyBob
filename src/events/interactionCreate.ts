import type { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../core/types/Event";

export default new Event("interactionCreate", (i) => {
  if (i.isCommand()) {
    const cmds = client.commands.get(i.commandName.toLowerCase());
    if (!cmds)
      return i.reply({ content: "This command does NOT exist lil bro" });

    cmds.run({
      args: i.options as CommandInteractionOptionResolver,
      client: client,
      ctx: i,
    });
  }
});
