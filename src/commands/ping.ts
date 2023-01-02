import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as server from "../server.js";
import buildEmbed from "../util/buildEmbed.js";

server.addCommand({
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    run: (interaction: ChatInputCommandInteraction) => {
        interaction.editReply({
            embeds: [
                buildEmbed("success", {
                    title: "Pong!",
                    description: `API Latency: ${Math.round(server.client.ws.ping)}ms\nBot latency: ${Math.round(
                        Date.now() - interaction.createdTimestamp
                    )}ms`
                })
            ]
        });
    }
});
