import type { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { client } from "..";
import { Event } from "../core/types/Event";
import type { ExtendedInteraction } from "../core/types/Command";
import { env } from "bun";

export default new Event("interactionCreate", (i) => {
  if (i.isCommand()) {
    const cmds = client.commands.get(i.commandName.toLowerCase());
    if (!cmds)
      return i.reply({ content: "This command does NOT exist lil bro" });
    i.member = i.guild?.members.cache.find(
      (f) => f.id === i.user.id
    ) as GuildMember;

    if (cmds.devOnly && i.member.id !== (env.DEV_ID as string)) {
      return i.reply({
        content: "Nuh uh",
        ephemeral: true,
      });
    }
    if(client.commandDisabled(cmds.name)) {
        return i.reply({ content: "Command is disabled dawg", ephemeral: true})
    }
    cmds.run({
      args: i.options as CommandInteractionOptionResolver,
      client: client,
      ctx: i as ExtendedInteraction,
    });
  }
});
