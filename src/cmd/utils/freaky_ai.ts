import {
  ApplicationCommandOptionType,
  DMChannel,
  TextChannel,
} from "discord.js";
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
    {
      name: "dm",
      description: "dm the response to you",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
  run: async ({ ctx, args }) => {
    const input = args.getString("input");
    const dmBool = args.getBoolean("dm") ?? false;
    if (!input) {
      ctx.reply({ content: "C'mon man give me some text", ephemeral: true });
    }

    let msg = await ctx.reply({
      content: `Generating response... (this may take awhile)`,
      ephemeral: true,
    });
    console.log(`\n\nAI Command:\n(${ctx.user.tag}) Input: ${input}`);
    const channel = dmBool
      ? (await ctx.guild?.members.cache
          .find((f) => f.id === ctx.user.id)
          ?.createDM() as DMChannel)
      : (ctx.channel as TextChannel);
    await ollama
      .chat({
        model: "llama3.1:8b",
        messages: [
          {
            role: "user",
            content: defaultPrompt(input as string),
          },
        ],
      })
      .then((r) => {
        msg.delete().catch(() => null);
        console.log(`Response: ${r.message.content}\n\n`);
        channel
          .send({
            content: r.message.content,
          })
          .catch(() => {
            if (dmBool) {
              ctx.reply({
                content: `Your dms were closed so whoops!`,
                ephemeral: true,
              });
            }
            (ctx.channel as TextChannel).send({
              content: r.message.content,
            });
          });
      });
  },
} as Command;
