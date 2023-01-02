import { APIEmbed } from "discord.js";
import * as classes from "./classes/classes.js";

export type BotConfig = {
    mainGuild: string;
    debug: boolean;
    commands: {
        [key: string]: classes.CommandConfig
    };
    baseEmbeds: {
        [key: string]: APIEmbed
    }
}