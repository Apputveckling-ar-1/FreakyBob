import { ApplicationCommandOptionType, resolveColor } from "discord.js";
import type { Command } from "../../core/types/Command";

export default {
  name: `example`,
  description: `Example command description duh`,
  options: [
    {
      name: `example_option`,
      description: "Description of option",
      type: ApplicationCommandOptionType.String, // Shift+Enter to see auto complete ( replace the String )
      required: true, //boolean ofc
    },
  ],
  //     The Options    Actual Discord.js Instance  The Interaction Context
  run: ({ args, client, ctx }) => {
    const inputArgument =
      args.getString(
        "example_option"
      ) /* string is the name of the option, and its like .getTYPE */ ??
      "No input somehow";

    // Reply to the context
    ctx.reply({
      content: `Example command 👍`, // Content of the message
      ephemeral: true, // Boolean (true -> only visable to author)
      embeds: [
        {
          title: "Example title",
          description: "Description (can be 1024 letters long)",
          fields: [
            {
              name: "Input",
              value: `${inputArgument}`,
            },
          ],
          footer: {
            text: `From ${ctx.member.user.tag}`,
          },
          color: resolveColor("Fuchsia"),
        },
      ],
    });
  },
} as Command;
