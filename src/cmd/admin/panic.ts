import { ButtonStyle, ComponentType } from "discord.js";
import type { Command } from "../../core/types/Command";

export default {
  name: "panic",
  description: "panic dawg",
  defaultMemberPermissions: "Administrator",
  run: ({ args, client, ctx }) => {
    if (!ctx.member.permissions.has("Administrator")) {
      const admins = ctx.guild?.members.cache.filter((f) =>
        f.permissions.has("Administrator") && !f.user.bot
      );
      return ctx.reply({
        content: `Nuhuh`,
      });
    }

    ctx.reply({
      content: `does bro wanna confirm this PURGE???`,
      ephemeral: true,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              custom_id: "confirm_button_purge",
              style: ButtonStyle.Danger,
              type: ComponentType.Button,
              label: "confirm",
            },
          ],
        },
      ],
    });
  },
} as Command;
