import * as server from "../server.js";
import * as discord from "discord.js";
import buildEmbed from "../util/buildEmbed.js";
import { formatUser } from "../util/formatter.js";

server.registerEvent(discord.Events.InteractionCreate, async (interaction: discord.Interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const command = server.commands.find((command) => command.data.name === interaction.commandName);
    if (!command) {
        const embed = buildEmbed("error", { description: "This command does not exist." });
        interaction.reply({ embeds: [embed] });
        return;
    }
    if (command.autoDefer ?? true) {
        await interaction.deferReply();
    }

    // find config
    const config = Object.entries(server.config.commands).find(([key, value]) => key === command.data.name)?.[1];
    if (!config) {
        interaction.editReply({ embeds: [buildEmbed("error", { description: "No configuration exists for this command." })] });
        server.echoError("No config found for command " + command.data.name);
        return;
    }

    if (!(config.enabled ?? true)) {
        interaction.editReply({ embeds: [buildEmbed("error", { description: "This command is disabled." })] });
        return;
    }

    // check for ratelimit
    if (server.globalSlashCommandRatelimits.has(command)) {
        const ratelimit = server.globalSlashCommandRatelimits.get(command);
        if (ratelimit && ratelimit > Date.now()) {
            interaction.editReply({ embeds: [buildEmbed("error", { description: "This command is currently under a global ratelimit." })] });
            return;
        }
    }

    if (server.perUserSlashCommandRatelimits.has(interaction.user)) {
        const userRatelimits = server.perUserSlashCommandRatelimits.get(interaction.user);
        if (userRatelimits && userRatelimits.has(command)) {
            const ratelimit = userRatelimits.get(command);
            if (ratelimit && ratelimit > Date.now()) {
                interaction.editReply({ embeds: [buildEmbed("error", { description: "You are currently ratelimited." })] });
                return;
            }
        }
    }

    try {
        server.echoDebug(`Running command ${command.data.name} executed from user ${formatUser(interaction.user)}...`);
        command.run(interaction, config);
        server.globalSlashCommandRatelimits.set(command, Date.now() + (command.globalRatelimitms ?? 0));
        const userRatelimits = server.perUserSlashCommandRatelimits.get(interaction.user);
        if (userRatelimits) {
            userRatelimits.set(command, Date.now() + (command.perUserRatelimitms ?? 0));
        }
    } catch (e) {
        interaction.editReply({ embeds: [buildEmbed("error", { description: "There was an error while running this command." })] });
        server.echoError((e as Error).stack ?? "");
    }
});

server.registerEvent(discord.Events.InteractionCreate, async (interaction: discord.Interaction) => {
    if (!interaction.isAutocomplete()) {
        return;
    }
    const command = server.commands.find((command) => command.data.name === interaction.commandName);
    if (!command) {
        return;
    }
    const config = Object.entries(server.config.commands).find(([key, value]) => key === command.data.name)?.[1];
    if (!config) {
        server.echoError("No config found for command " + command.data.name);
        return;
    }
    const option = interaction.options.getFocused(true);
    const output = command.autoCompletes?.[option.name]?.(interaction, command, option, config);
    if (output) {
        interaction.respond(output);
    }
});
