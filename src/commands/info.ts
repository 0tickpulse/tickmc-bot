import * as server from "../server.js";
import { APIEmbed, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import buildEmbed, { reallySimpleEmbed } from "../util/buildEmbed.js";
import { CommandConfig, tCommand } from "../classes/classes.js";

const infos: { [infoName: string]: APIEmbed } = server.config.commands.info.infoEmbeds;
infos["list"] = buildEmbed("info", {
    title: "Info messages",
    description: Object.keys(infos)
        .map((infoName) => `\`${infoName.split(",")[0].trim()}\``)
        .join(", ")
});

const execute = (interaction: ChatInputCommandInteraction, config: CommandConfig) => {
    if (!infos) {
        interaction.editReply({
            embeds: [reallySimpleEmbed("error", "This server has no info messages.")]
        });
    }

    const name = interaction.options.getString("name");
    if (name === null) {
        // ! THIS SHOULD NEVER HAPPEN!
        interaction.editReply({
            embeds: [reallySimpleEmbed("error", "An error occurred while processing your command. Please try again later.")]
        });
        return;
    }

    const infoName = Object.keys(infos).find((infoName) =>
        infoName
            .split(",")
            .map((name) => name.trim().toLowerCase())
            .includes(name.toLowerCase())
    );
    if (!infoName) {
        interaction.editReply({
            embeds: [reallySimpleEmbed("error", "That info message does not exist.")]
        });
        return;
    }

    interaction.editReply({
        embeds: [buildEmbed("info", infos[infoName])]
    });
};

server.addCommand({
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Gets staff-written info messages.")
        .addStringOption((option) => option.setName("name").setDescription("The name of the info message.").setRequired(true).setAutocomplete(true)),
    run: execute,
    autoCompletes: {
        name: (interaction, command: tCommand, option, config) => {
            return Object.keys(infos)
                .map((infoName) => infoName.split(","))
                .flat()
                .map((name) => name.trim())
                .filter((name) => name.startsWith(option.value))
                .map((name) => ({ name, value: name }));
        }
    }
});
