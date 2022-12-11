import * as discord from "discord.js";
import * as fs from "fs/promises";
import * as path from "path";
import * as url from "url";
import * as yaml from "yaml";
import * as classes from "./classes/classes.js";
import * as colors from "./util/colors.js";
import * as files from "./util/files.js";

// Dirname setup
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Config setup
const token = yaml.parse(await fs.readFile(path.join(__dirname, "..", "config", "token.yml"), "utf8"))["token"];

/**
 * Gets the bot's token. **Should almost never be used.**
 */
export const getToken = () => {
    return token;
};

/**
 * Re-scans the configuration file. **Should never be used.**
 */
const scanConfig = async (): Promise<{ [key: string]: any }> => {
    return yaml.parse(await fs.readFile(path.join(__dirname, "..", "config", "config.yml"), "utf8"));
};

/**
 * The main configuration file of the bot, stored under `config/config.yml`.
 */
export let config = await scanConfig();

/**
 * Re-scans the configuration file and returns it.
 */
export const reloadConfig = () => {
    echoDebug("Reloading config...");
    config = scanConfig();
    echoDebug("Config transferred from file to memory.");
    return config;
};

// Debuggers

/**
 * Sends a message to the console.
 * @param message The message to echo.
 */
export const echoLog = (message: string): void => console.log(message);

/**
 * Sends a debug message. This will only be sent if the `debug` option is set to `true` in the configuration file.
 * @param message The message to echo.
 */
export const echoDebug = (message: string): void => {
    if (config["debug"]) {
        console.log(message);
    }
};

/**
 * Sends an error message to the console.
 * @param error The error to echo.
 */
export const echoError = (error: string): void =>
    console.log(
        `${colors.basic.red.fore}!!! ${colors.basic.white.fore}An error has occured!\n${colors.basic.gray.fore}    Error message: ${colors.basic.white.fore}${error}${colors.codes.reset}`
    );

// Client setup

export const client = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });
client.login(token);

// Event setup

export const events: classes.tEvent[] = [];

/**
 * Registers an event handler for the bot. This will automatically use try catch to prevent the bot from crashing.
 * @param event The event to register the handler for.
 * @param handler The function to be called when the event is triggered.
 * @param once Whether the handler should be called only once.
 */
export const registerEvent = (event: keyof discord.ClientEvents, handler: (...args: any[]) => any, once: boolean = false): any => {
    const tryCatchHandler = (...args: any[]): any => {
        try {
            handler(...args);
        } catch (error) {
            echoError(`Unexpected error while handling event ${event}: ${error}`);
        }
    };
    once ? client.once(event, tryCatchHandler) : client.on(event, tryCatchHandler);
    events.push({ event: event, run: handler, once: once });
};

files.deepGetFiles(path.join(__dirname, "events")).then((files): void => {
    files.forEach((file: string): void => {
        if (path.extname(file) !== ".js") {
            return;
        }
        import(url.pathToFileURL(file).toString());
    });
});

// Command setup

/**
 * An internal list of commands. **Should never be written to.**
 */
export const commands: classes.tCommand[] = [];

/**
 * Adds a command to the server's command list. Will not be regsitered onto the bot until {@link registerCommands} is called.
 * @param command The command.
 * @param run The function to be called when the command is triggered.
 */
export const addCommand = (command: discord.SlashCommandBuilder, run: (interaction: discord.CommandInteraction) => void): void => {
    commands.push({ data: command, run: run });
};

/**
 * Imports all commands from the `commands` directory.
 */
export const importCommands = async () => {
    const commandFiles = await files.deepGetFiles(path.join(__dirname, "commands"));
    await Promise.all(
        commandFiles.filter((file: string) => path.extname(file) === ".js").map((file: string) => import(url.pathToFileURL(file).toString()))
    );
};

/**
 * Registers all commands into the REST API.
 */
export const registerCommands = async (): Promise<void> => {
    try {
        const rest = new discord.REST().setToken(token);
        const id = client.user?.id as string;
        const guild = config["mainGuild"].toString();
        await rest.put(discord.Routes.applicationGuildCommands(id, guild), {
            body: commands.map((command) => command.data.toJSON())
        });
        echoDebug("Successfully registered application commands.");
    } catch (error: any) {
        console.error(error);
    }
};

if (process.argv.includes("--registerCommands")) {
    registerEvent(
        discord.Events.ClientReady,
        async () => {
            await importCommands();
            registerCommands();
        },
        true
    );
}

/**
 * Exits the program.
 * @param code The error code to be sent.
 */
export const exit = (code: number = 0): void => {
    client.destroy();
    process.exit(code);
};
