import { env } from "bun";
import type {
  ButtonInteraction,
  Guild,
  GuildMember,
  TextChannel,
} from "discord.js";
import config from "../config";

export const confirmPurgeButton = (i: ButtonInteraction) => {
  i.reply({
    content: `Purge confirmed...`,
    ephemeral: true,
  });

  const me = i.guild?.members.cache.find(
    (f) => f.id === (env.DEV_ID as string)
  ) as GuildMember;

  me.send({
    content: `Purged - Perm URL: ${config.perm_invite}`,
  });

  const channel = i.channel as TextChannel;
  const guild = i.guild as Guild;
  let guild_size = guild.memberCount;
  let banned = [];

  guild.members.cache.forEach((member) => {
    if (member.user.bot) return;
    banned.push(member.id);
    member.kick("Purged").catch((e) => {
      (i.channel as TextChannel).send({
        content: `<@${member.id}> Leave ASAP`,
      });
    });
    channel.send({
      content: `Kicked for: ${member.user.tag}`,
    });
  });

  let confirmedBanMsg = `Confirmed ${banned.length}/${guild_size} kicked.`;

  me.send({
    content: confirmedBanMsg,
  });

  channel.send({
    content: confirmedBanMsg,
  });
};
