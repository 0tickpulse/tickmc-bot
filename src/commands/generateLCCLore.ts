import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import * as server from "../server.js";
import buildEmbed from "../util/buildEmbed.js";
import { generate } from "../modules/lccLoreGenerator.js";
import * as yaml from "yaml";
import { hasteBin } from "../util/hastebin.js";

const invalidYAMLEmbed = (err?: string) => ({
    embeds: [
        buildEmbed("error", {
            description: "The file you provided is not valid YAML" + (err ? ":\n```" + err + "\n```" : "!")
        })
    ]
});

server.addCommand({
    data: new SlashCommandBuilder()
        .setName("generatelcclore")
        .setDescription("Generates lore for LCC items.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addAttachmentOption((option) => option.setName("file").setDescription("A YAML file to generate lore for.").setRequired(true)),
    run: async (interaction: ChatInputCommandInteraction) => {
        // get the attachment contents
        const link = interaction.options.getAttachment("file")?.attachment.toString();
        if (!link) {
            interaction.editReply({
                embeds: [
                    buildEmbed("error", {
                        description: "You must provide a file."
                    })
                ]
            });
            return;
        }

        const contents = await (await fetch(link)).text();

        let parsed;
        try {
            parsed = generate(yaml.parse(contents));
        } catch (e) {
            interaction.editReply(invalidYAMLEmbed(e as string));
            return;
        }

        if (!parsed || typeof parsed !== "object") {
            interaction.editReply(invalidYAMLEmbed());
            return;
        }
        // upload to hastebin
        const url = await hasteBin(yaml.stringify(parsed, { lineWidth: 1000, defaultStringType: "QUOTE_SINGLE", defaultKeyType: "PLAIN" }));

        interaction.editReply({ embeds: [buildEmbed("success", { title: "Successfully generated lore!", description: `Link: ${url}` })] });
    },
    perUserRatelimitms: 10000,
    globalRatelimitms: 5000
});
