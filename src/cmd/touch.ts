import {
  ApplicationCommandOptionType,
  DMChannel,
  TextChannel,
} from "discord.js";
import type { Command } from "../core/types/Command";

export default {
  name: "touch",
  description: "you know what",
  options: [
    {
      name: "person",
      description: "the person duh",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async ({ ctx, args }) => {
    const mention = args.getUser("person");
    if (!mention) {
      ctx.reply({
        content: `C'mon tell me someone atleast.`,
        ephemeral: true,
      });
    }
    let c = `You might of just been touched 😝 (by <@1110983845005758474>)`;
    ((await mention?.createDM(true)) as DMChannel)
      .send({
        content: c,
      })
      .catch(() => {
        (ctx.channel as TextChannel).send({
          content: c,
        });
      });

    ctx.reply({ content: "Message sent!", ephemeral: true });
  },
} as Command;
