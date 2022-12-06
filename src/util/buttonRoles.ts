import * as discord from "discord.js";

export class ButtonRoles {
    public constructor(public embed: discord.EmbedBuilder, public buttons: discord.ButtonBuilder[] = []) {}
    public addButton(button: discord.ButtonBuilder) {
        this.buttons.push(button);
    }
    public send(channel: discord.TextBasedChannel) {
        channel.send({ embeds: [this.embed], components: [new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(this.buttons)] });
    }
}
