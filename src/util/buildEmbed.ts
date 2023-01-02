import * as discord from "discord.js";
import * as server from "../server.js";

const buildEmbed = (type: string, ...additionalData: discord.APIEmbed[]): discord.APIEmbed => {
    const embedConfig: discord.APIEmbed = server.config.baseEmbeds?.[type] ?? undefined;
    if (embedConfig === undefined) {
        server.echoError(`Embed type "${type}" not found.`);
        return {};
    }
    return Object.assign(embedConfig, ...additionalData);
};

/**
 * Builds an embed from a specified type. This type is used to determine certain properties, and is user-specified in that the function reads the embed type data from {@link server.config}.
 * @param type The type of embed to create. This can be any type from {@link server.config}.
 * @param additionalData Additional data to add to the embed. This is directly added to the embed.
 * This is provided as an alternativee to {@link Object.assign} or spread syntax to add additional data, and results in code being cleaner.
 *
 * Here is an example of how embed types are configured:
 *
 * ```yaml
 * baseEmbeds.success.color: 5763719
 * ```
 *
 * This sets the color of the "success" embed type to `5763719`.
 *
 * Now, you can use the `buildEmbed` function to create a success embed:
 *
 * ```ts
 * const embed = buildEmbed("success");
 * ```
 */
export default buildEmbed;

export const reallySimpleEmbed = (type: string, description: string): discord.APIEmbed => {
    return buildEmbed(type, { description });
};
