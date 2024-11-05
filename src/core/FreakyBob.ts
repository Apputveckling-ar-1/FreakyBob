import {
  Client,
  Collection,
  GatewayIntentBits,
  Guild,
  IntentsBitField,
  Partials,
  REST,
  Routes,
  type ApplicationCommandDataResolvable,
  type ClientEvents,
  type GatewayIntentsString,
  type Snowflake,
} from "discord.js";
import type { Command } from "./types/Command";
import { env, Glob } from "bun";
import type { Event } from "./types/Event";

const defaultGlob = new Glob(`**/*{.ts,.js}`);

export default class FreakyBob extends Client {
  commands: Collection<string, Command> = new Collection();
  disabledCommands: string[] = ["freaky"];
  constructor() {
    super({
      intents: Object.keys(GatewayIntentBits) as GatewayIntentsString[],
      allowedMentions: {
        repliedUser: true,
      },
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }

  public async start() {
    let cmds = await this.loadCommands();
    this.registerCommands(cmds);
    this.registerEvents();
    this.login(env.TOKEN as string);
  }

  public commandDisabled(commandName: string) {
    return this.disabledCommands.filter(
      (f) => f.toLowerCase() === commandName.toLowerCase()
    ).length > 0
      ? true
      : false;
  }

  private async importFile(filePath: string) {
    return (await import(`${process.cwd()}/src/${filePath}`))?.default;
  }

  private async registerEvents() {
    for await (let file of defaultGlob.scan(`${process.cwd()}/src/events/`)) {
      const ev: Event<keyof ClientEvents> = await this.importFile(
        `events/${file}`
      );
      if (!ev.event) return;
      this.on(ev.event, ev.run);
    }
  }

  private async registerCommands(
    commands: ApplicationCommandDataResolvable[] | undefined
  ) {
    if (!commands) {
      console.log("No commands provided.");
      return;
    }
    const rest = new REST().setToken(env.TOKEN as string);
    try {
      console.log("Refreshing commands (/)");
      const data = await rest.put(
        Routes.applicationGuildCommands(
          env.CLIENT_ID as Snowflake,
          env.GUILD_ID as string
        ),
        { body: commands }
      );
      console.log("Commands refreshed (/)");
    } catch (e) {
      console.error(e);
    }
  }

  private async loadCommands() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    for await (let file of defaultGlob.scan(`${process.cwd()}/src/cmd/`)) {
      const cmd = (await this.importFile(`cmd/${file}`)) as Command;
      if (!cmd.name) return;
      this.commands.set(cmd.name.toLowerCase(), cmd);
      slashCommands.push(cmd);
    }
    return slashCommands;
  }
}
