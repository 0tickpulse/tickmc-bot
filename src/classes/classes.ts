import * as discord from "discord.js";
import * as server from "../server.js";

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
export interface tCommand {
    /**
     * The data of the slash command. Controls the properties of the command, such as the name, description, and options.
     *
     * Refer to Discord.js's documentation for more information.
     */
    data: discord.SlashCommandBuilder;
    /**
     * A function that runs when the command is triggered.
     * @param interaction The interaction that triggered the command.
     */
    run: (interaction: discord.CommandInteraction) => void;
}

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
export interface tEvent {
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
}
