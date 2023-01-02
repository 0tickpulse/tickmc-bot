import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import * as server from "../server.js";
import buildEmbed from "../util/buildEmbed.js";

server.addCommand({
    data: new SlashCommandBuilder().setName("reload").setDescription("Reloads the bot.").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    run: (interaction: ChatInputCommandInteraction) => {
        interaction.editReply({
            embeds: [
                buildEmbed("warning", {
                    title: "Reloading",
                    description: "Moving the configuration from the config file to cache..."
                })
            ]
        });
        server.reloadConfig();
    }
});
