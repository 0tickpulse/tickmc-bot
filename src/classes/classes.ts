import * as discord from "discord.js";
export interface tCommand {
    data: discord.SlashCommandBuilder;
    run: (interaction: discord.CommandInteraction) => void
}