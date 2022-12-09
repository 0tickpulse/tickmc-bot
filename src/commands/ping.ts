import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as server from "../server.js";
import { buildEmbed } from "../util/embedBuilder.js";

server.addCommand(new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"), (interaction: CommandInteraction) => {
    interaction.reply({ embeds: [buildEmbed("success", { description: "Pong!" })] });
});
