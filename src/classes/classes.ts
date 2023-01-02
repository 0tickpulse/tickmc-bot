import * as discord from "discord.js";
import * as server from "../server.js";

/**
 * A generic slash command because typing everything is hell.
 */
export type GenericSlashCommand = discord.SlashCommandBuilder | Omit<discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

/**
 * This class represents the configuration for a bot's application command, as defined under config.yml's commands section.
 */
export type CommandConfig = {
    enabled: boolean;
    [key: string]: any;
};

/**
 * This class represents a slash command for a Discord Bot.
 *
 * This class is used to create a slash command, and is used in the {@link server.addCommand} function.
 * Although most end users would not need to use this class, it is used in the internals of the aforementioned function.
 *
 * # Example
 *
 * ```ts
 * server.addCommand(new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"), (interaction: CommandInteraction) => {
 *    interaction.reply({ embeds: [buildEmbed("success", { description: "Pong!" })] });
 * });
 * ```
 *
 * The above code uses the {@link server.addCommand} function to add a slash command to the bot.
 *
 * The first field, `new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!")`, is the data of the slash command.
 *
 * The second field, `(interaction: CommandInteraction) => { interaction.reply({ embeds: [buildEmbed("success", { description: "Pong!" })] }); }`, is the function that runs when the command is triggered.
 *
 * The function is passed the interaction that triggered the command, and can be used to reply to the interaction.
 */
export type tCommand = {
    /**
     * The data of the slash command. Controls the properties of the command, such as the name, description, and options.
     *
     * Refer to Discord.js's documentation for more information.
     */
    data: GenericSlashCommand;
    /**
     * A function that runs when the command is triggered.
     * @param interaction The interaction that triggered the command.
     */
    run: (interaction: discord.ChatInputCommandInteraction, config: CommandConfig) => void;
    /**
     * Whether the command should automatically defer.
     * This is equivalent to `interaction.deferReply()`.
     *
     * Defaults to false.
     */
    autoDefer?: boolean;
    /**
     * A map of option names to functions that run when the option is auto-completed.
     */
    autoCompletes?: {
        [optionName: string]: tCommandAutoComplete;
    };
    /**
     * A global cooldown for the command, in milliseconds.
     */
    globalRatelimitms?: number;
    /**
     * A per-user cooldown for the command, in milliseconds.
     */
    perUserRatelimitms?: number;
};

/**
 * A function that runs when the option is auto-completed.
 */
export type tCommandAutoComplete = (
    interaction: discord.AutocompleteInteraction,
    command: tCommand,
    option: discord.AutocompleteFocusedOption,
    config: CommandConfig
) => discord.ApplicationCommandOptionChoiceData<string | number>[];

/**
 * This class represents an event for a Discord Bot.
 *
 * This class is used to create an event, and is used in the {@link server.registerEvent} function.
 *
 * Although most end users would not need to use this class, it is used in the internals of the aforementioned function.
 *
 * (This is also what is used to listen to commands.)
 *
 * # Example
 *
 * ```ts
 * server.registerEvent(discord.Events.ClientReady, () => {
 *    console.log("Bot is ready!");
 * });
 * ```
 *
 * The above code uses the {@link server.registerEvent} function to register an event handler for the bot. This function then adds a generated tEvent to the bot's event list.
 *
 * The first field, `discord.Events.ClientReady`, is the name of the event. The second field, `() => { console.log("Bot is ready!"); }`, is the function that runs when the event is triggered.
 *
 * This event as a whole triggers when the bot successfully logs in, logging the message "Bot is ready!" to the console.
 *
 * The function is passed the arguments that the event is triggered with.
 */
export type tEvent = {
    /**
     * This determines when the event is triggered.
     */
    event: keyof discord.ClientEvents;
    /**
     * A function that runs when the event is triggered.
     * @param args The arguments that the event is triggered with. Refer to discord.js documentation.
     */
    run: (...args: any[]) => void;
    /**
     * Whether the event should only trigger once.
     */
    once: boolean;
};
