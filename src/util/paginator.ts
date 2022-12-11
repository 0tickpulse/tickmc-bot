import * as discord from "discord.js";
import * as server from "../server.js";

/**
 * # Tick's Paginator
 *
 * This class is a data structure that holds the data for a paginator, allowing one to send embeds with certain functional buttons on them.
 * These buttons can be used to navigate through the pages of the paginator.
 *
 * @param pages The pages of the paginator that the user can navigate through.
 * @param timeout The timeout for the buttons. Defaults to 5 minutes (`30000`).
 * After the timeout, the buttons will be disabled.
 * This is to prevent the buttons from staying on the message forever (which can cause memory leaks).
 * @param buttons The buttons to use. The first button will be used to go to the previous page, the second button will be used to go to the next page.
 *
 *
 * Here's an example of the Paginator being used:
 *
 * ```ts
 * const paginator = new Paginator();
 * paginator.addPage(new MessageEmbed().setTitle("Page 1"));
 * paginator.addPage(new MessageEmbed().setTitle("Page 2"));
 * paginator.addPage(new MessageEmbed().setTitle("Page 3"));
 * await paginator.send(message.channel);
 * ```
 *
 * When the send method is called, the paginator will send the **first page** of the paginator, and add the buttons to the message.
 * The buttons will be added to the message, and the user can click on them to navigate through the pages.
 *
 * In addition, you can specify your own buttons instead of the default ones provided in the class.
 * To do this, you add {@link discord.ButtonBuilder} objects when using the constructor.
 *
 * ## Practical use case
 *
 * A practical use case for this class is when you want to send a list of items, but you don't want to send them all at once.
 * For example, if you want to send a list of 100 items, you can use this class to send 10 items per page, and let the user navigate through the pages.
 *
 * ```ts
 * const items = [["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10"], ["Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20"], ["Item 21", "Item 22", "Item 23", "Item 24", "Item 25", "Item 26", "Item 27", "Item 28", "Item 29", "Item 30"], ["Item 31", "Item 32", "Item 33", "Item 34", "Item 35", "Item 36", "Item 37", "Item 38", "Item 39", "Item 40"], ["Item 41", "Item 42", "Item 43", "Item 44", "Item 45", "Item 46", "Item 47", "Item 48", "Item 49", "Item 50"], ["Item 51", "Item 52", "Item 53", "Item 54", "Item 55", "Item 56", "Item 57", "Item 58", "Item 59", "Item 60"], ["Item 61", "Item 62", "Item 63", "Item 64", "Item 65", "Item 66", "Item 67", "Item 68", "Item 69", "Item 70"], ["Item 71", "Item 72", "Item 73", "Item 74", "Item 75", "Item 76", "Item 77", "Item 78", "Item 79", "Item 80"], ["Item 81", "Item 82", "Item 83", "Item 84", "Item 85", "Item 86", "Item 87", "Item 88", "Item 89", "Item 90"], ["Item 91", "Item 92", "Item 93", "Item 94", "Item 95", "Item 96", "Item 97", "Item 98", "Item 99", "Item 100"]];
 * const paginator = new Paginator();
 * items.forEach(item => paginator.addPage(new discord.MessageEmbed().setTitle(item.join(", ")));
 * await paginator.send(message.channel);
 * ```
 *
 * In this example, the paginator will send 10 items per page, and the user can navigate through the pages using the buttons.
 *
 * A common example for this is when displaying a list of a large amount of items in a database.
 * For example, many bots have a command that sends a list of warnings applied on a certain user.
 * If a user has many warnings, it would be a good idea to use this class to send the warnings in pages, instead of sending them all at once.
 * Otherwise, the message would be too long, and the user would have to constantly scroll up and down to see the warnings.
 */
export class Paginator {
    public constructor(
        public pages: discord.EmbedBuilder[] = [],
        public timeout: number = 300000,
        public buttons: [discord.ButtonBuilder, discord.ButtonBuilder] = [
            new discord.ButtonBuilder().setCustomId("prev").setLabel("Previous").setStyle(discord.ButtonStyle.Primary),
            new discord.ButtonBuilder().setCustomId("next").setLabel("Next").setStyle(discord.ButtonStyle.Primary)
        ]
    ) {}

    /**
     * Adds an additional page to the paginator and returns the paginator object.
     * @param page A new page to add to the paginator.
     */
    public addPage(page: discord.EmbedBuilder) {
        this.pages.push(page);
        return this;
    }

    /**
     * Removes a page from the paginator and returns the paginator object. The page is removed by the specified index.
     *
     * @param index The index of the page to remove.
     *
     * An example of this method being used:
     *
     * ```ts
     * const paginator = new Paginator();
     * paginator.addPage(new MessageEmbed().setTitle("Page 1"));
     * paginator.addPage(new MessageEmbed().setTitle("Page 2"));
     * paginator.addPage(new MessageEmbed().setTitle("Page 3"));
     * paginator.removePage(1);
     * ```
     *
     * In the above example, the second page of the paginator will be removed.
     * This means that the paginator will only have two pages, and the first page will be "Page 1", and the second page will be "Page 3".
     */
    public removePage(index: number) {
        this.pages.splice(index, 1);
        return this;
    }

    /**
     * Sets the button to use for the paginator and returns the paginator object.
     * @param buttons An array of two items, where the first item is the button to go to the previous page, and the second item is the button to go to the next page.
     * Keep in mind that in some cases, you would want to only change one button instead of two.
     * To do that, you can use the {@link Paginator.setPreviousPageButton} and {@link Paginator.setNextPageButton} methods instead.
     *
     * To illustrate why you would want to use those methods, here's an example of the `setButtons` method being used to change one button:
     *
     * ```ts
     * const paginator = new Paginator().setButtons([new ButtonBuilder().setCustomId("prev").setLabel("Left").setStyle(ButtonStyle.Primary), paginator.buttons[1]]);
     * ```
     *
     * In the above example, the "Previous page" button will be changed to "Left", and the "Next page" button will remain the same.
     * However, this is redundnat boilerplate code. Here is what it would look like if you use the `setPreviousButton` method instead:
     *
     * ```ts
     * const paginator = new Paginator().setPreviousButton(new ButtonBuilder().setCustomId("prev").setLabel("Left").setStyle(ButtonStyle.Primary));
     * ```
     *
     * As you can see, the `setPreviousButton` method is much cleaner and easier to use. Hence, in this use case, it is recommended to use this method instead of the `setButtons` method.
     * Hence, it is important to note that this method is only useful when you want to change both buttons at the same time.
     *
     * If you are defining the buttons as a variable, you can also instead directly set the `buttons` field.
     * For example, the following code is equivalent to the above code:
     *
     * ```ts
     * const paginator = new Paginator();
     * paginator.buttons[0] = new ButtonBuilder().setCustomId("prev").setLabel("Left").setStyle(ButtonStyle.Primary);
     * ```
     */
    public setButtons(buttons: [discord.ButtonBuilder, discord.ButtonBuilder]) {
        this.buttons = buttons;
        return this;
    }

    /**
     * Sets the timeout for the buttons in the paginator and returns the paginator object.
     * @param timeout The timeout for the buttons. Defaults to 5 minutes (`30000`).
     */
    public setTimeout(timeout: number) {
        this.timeout = timeout;
        return this;
    }

    /**
     * Sets the "Previous page" button in the paginator and returns the paginator object.
     * @param button The button to go to the previous page.
     * @see Paginator.setButtons
     */
    public setPreviousPageButton(button: discord.ButtonBuilder) {
        this.buttons[0] = button;
        return this;
    }

    /**
     * Sets the "Next page" button in the paginator and returns the paginator object.
     * @param button The button to go to the next page.
     * @see Paginator.setButtons
     */
    public setNextPageButton(button: discord.ButtonBuilder) {
        this.buttons[1] = button;
        return this;
    }

    /**
     * Sends the paginator to the specified channel. This method will send the first page of the paginator, and add the buttons to the message.
     * Keep in mind that this method will only work if the paginator has at least one page. If the paginator has no pages, this method will throw an error.
     * In addition, this method will return the message that was sent.
     *
     * @param channel The channel to send the paginator to.
     * @param firstPageMessage The message to send when the user is on the first page. Defaults to an ephemeral "This is the first page.". **Generally not needed.**
     * @param lastPageMessage The message to send when the user is on the last page. Defaults to an ephemeral "This is the last page.". **Generally not needed.**
     *
     * ## Example
     *
     * ```ts
     * const paginator = new Paginator();
     * paginator.addPage(new MessageEmbed().setTitle("Page 1"));
     * paginator.addPage(new MessageEmbed().setTitle("Page 2"));
     * paginator.addPage(new MessageEmbed().setTitle("Page 3"));
     * const message = await paginator.send(channel);
     * ```
     */
    public async send(
        channel: discord.TextBasedChannel,
        firstPageMessage: string | discord.MessagePayload | discord.InteractionReplyOptions = { content: "This is the first page.", ephemeral: true },
        lastPageMessage: string | discord.MessagePayload | discord.InteractionReplyOptions = { content: "This is the last page.", ephemeral: true }
    ) {
        if (this.pages.length === 0) {
            server.echoError("Paginator has no pages.");
        }

        let page = 0;

        const message = await channel.send({
            embeds: [this.pages[0]],
            components: [new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(...this.buttons)]
        });

        const collector = new discord.InteractionCollector<discord.ButtonInteraction>(channel.client, {
            filter: (interaction: discord.ButtonInteraction) => interaction.message.id === message.id,
            time: this.timeout
        });

        collector.on("collect", async (interaction: discord.ButtonInteraction) => {
            if (interaction.customId === "prev") {
                if (page === 0) {
                    interaction.reply(firstPageMessage);
                    return;
                }
                page--;
            } else if (interaction.customId === "next") {
                if (page === this.pages.length - 1) {
                    interaction.reply(lastPageMessage);
                    return;
                }
                page++;
            }
            await interaction.update({
                embeds: [this.pages[page]],
                components: [new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(...this.buttons)]
            });
        });

        collector.on("end", () => {
            message.edit({
                embeds: [this.pages[page]],
                components: [
                    new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(...this.buttons.map((button) => button.setDisabled(true)))
                ]
            });
        });

        return message;
    }
}
