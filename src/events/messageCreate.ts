import type { GuildMember, TextChannel } from "discord.js";
import config from "../config";
import { Event } from "../core/types/Event";
import { resolveColor } from "discord.js";

export default new Event("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id === config.suggestionsChannelId) {
    const suggestionsChannel = message.guild?.channels.cache.find(
      (f) => f.id === config.suggestionsChannelId
    ) as TextChannel;
    if (!suggestionsChannel) {
      console.log(`ERRROROOR!!! NO FIND SUGGESTION CHAT`);
    }
    const member = message.guild?.members.cache.find(
      (f) => f.id === message.author.id
    ) as GuildMember;
    // message.delete().catch(() => null);
    let msg = await suggestionsChannel.send({
      embeds: [
        {
          author: {
            name: `${message.author.tag}`,
            icon_url: member.avatarURL({ size: 256 }) as string,
          },
          description: `${message.content.slice(0, 1024)}`,
          color: resolveColor("Fuchsia"),
        },
      ],
    });

    await msg.react("✅");
    await msg.react("❌");

    (await member.createDM())
      .send({ content: "thx for suggestion 😈" })
      .catch(() => null);
  }
});
