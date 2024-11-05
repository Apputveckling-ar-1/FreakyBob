import {
  ApplicationCommandOptionType,
  ChannelType,
  TextChannel,
} from "discord.js";
import type { Command } from "../../core/types/Command";

export default {
  name: "clear",
  description: "clear a channel",
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: "channel",
      description: "duh?",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  run: ({ args, client, ctx }) => {
    if (!ctx.member.permissions.has("Administrator")) {
      return ctx.reply({ content: `Nonono, you cannot use this` });
    }

    const channel = args.getChannel("channel")
      ? (ctx.guild?.channels.cache.find(
          (f) =>
            f.id === args.getChannel("channel")?.id &&
            f.type === ChannelType.GuildText
        ) as TextChannel)
      : (ctx.channel as TextChannel);

    channel.messages.fetch({ limit: 100 }).then((msg) => {
      msg.forEach((m) => {
        m.delete().catch(() => null);
      });
    });

    ctx
      .reply({ content: "Cleared msgs on god on god", ephemeral: true })
      .catch(() => null);
  },
} as Command;
