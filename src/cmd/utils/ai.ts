import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import type { Command } from "../../core/types/Command";
import ollama from "ollama";
import { defaultPrompt } from "../../utils/ollama";

export default {
  name: "freaky",
  description: "freaky bob ai",
  options: [
    {
      name: "input",
      description: "freaky input",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ ctx, args }) => {
    const input = args.getString("input");
    if (!input) {
      ctx.reply({ content: "C'mon man give me some text", ephemeral: true });
    }
    console.log(input);
    let msg = await ctx.reply({
      content: `Generating response...`,
      ephemeral: true,
    });

    const res = await ollama
      .chat({
        model: "llama3.2",
        messages: [
          {
            role: "user",
            content: defaultPrompt(input as string),
          },
        ],
      })
      .then((r) => {
        msg.delete().catch(() => null);

        (ctx.channel as TextChannel).send({
          content: r.message.content,
        });
      });
  },
} as Command;
