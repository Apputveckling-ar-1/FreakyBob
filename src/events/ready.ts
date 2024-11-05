import { IntentsBitField } from "discord.js";
import { Event } from "../core/types/Event";

export default new Event("ready", () => {
  console.log(`Might be ready perchance?`);
});
