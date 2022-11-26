import * as discord from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as files from "src/util/files.js";
import * as json from "jsonc-parser";

// Config setup
const token = json.parse(fs.readFileSync(path.join(__dirname, "config", "token.yml"), "utf8"))["token"];

/**
 * Re-scans the configuration file. **Should never be used.**
 */
const scanConfig = () => {
    try {
        return json.parse(fs.readFileSync(path.join(__dirname, "config", "config.yml"), "utf8"));
    } catch (e) {
        console.error(e);
    }
};

let config = scanConfig();

/**
 * Re-scans the configuration file and returns it.
 */
export const reloadConfig = () => {
    config = scanConfig();
    return config;
};
/**
 * Gets the configuration file.
 */
export const getConfig = () => {
    return config;
};

// Debuggers

// export const echoDebug = (message: string): void => {
//     if (getConfig()["debug"]) {
//         console.log(message);
//     }
// };

// export const echoError = (error: Error): void => {
//     console.log(`An error has occured: ${error.message}`);
// }

// Client setup

const client = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });
client.login(token);

/**
 * Gets the bot's client instance.
 */
export const getClient = () => client;

// Event setup

/**
 * Registers an event handler for the bot.w
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

files.deepGetFiles("src/events").then((files: string[]) => {
    files.forEach((file: string) => {
        require(file);
    });
});
