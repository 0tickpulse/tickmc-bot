import * as discord from "discord.js";
import { token } from "src/config/token.json";

const client = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });
client.login(token);

/**
 * Gets the bot's client instance.
 */
export const getClient = () => client;

/**
 * Registers an event handler for the bot.
 * @param {discord.Event} event The event to register the handler for.
 * @param {Function} handler The function to be called when the event is triggered.
 * @param {boolean} once Whether the handler should be called only once.
 */
export const registerEvent = (event: keyof discord.ClientEvents, handler: () => any, once: boolean = false): void => {
    if (once) {
        client.once(event, handler);
        return;
    }
    client.on(event, handler);
};
