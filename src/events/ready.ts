import * as server from "../server.js";
import * as discord from "discord.js";
import * as fs from "fs/promises";
import * as path from "path";
import * as url from "url";
import * as readline from "readline";
import * as paginator from "../util/paginator.js";
import * as repl from "node:repl";

// Dirname setup
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const inputHistory: string[] = [];

const sendInput = () => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, history: inputHistory });
    rl.question(">> ", async (input: string) => {
        inputHistory.push(input);
        const split = input.trim().split(" ");
        const command = split[0];
        const args = split.slice(1);
        switch (command.toLowerCase()) {
            case "exit":
                server.exit();
            case "repl":
                rl.close();
                const replServer = repl.start({ prompt: "REPL >> " });
                replServer.context.server = server;
                replServer.context.discord = discord;
                replServer.on("exit", () => {
                    sendInput();
                });
                return;
            case "reload":
                server.reloadConfig();
                break;
            case "registercommands":
                await server.importCommands();
                await server.registerCommands();
                break;
            case "buttontest":
                const button = new discord.ButtonBuilder().setCustomId("test").setLabel("Test").setStyle(discord.ButtonStyle.Primary);
                const embed = new discord.EmbedBuilder().setTitle("Test").setDescription("This is a test.");
                const message = await (server.client.channels.cache.get("967427683506077767") as discord.TextChannel).send({
                    embeds: [embed],
                    components: [new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents([button])]
                });
                const collector = new discord.InteractionCollector<discord.ButtonInteraction>(server.client, {
                    filter: (interaction: discord.ButtonInteraction) => interaction.message.id === message.id,
                    time: 10000
                });
                collector.on("collect", (interaction: discord.ButtonInteraction) => {
                    if (!interaction.isButton()) {
                        return;
                    }
                    const newActionRowComponents = interaction.message.components.map((old) =>
                        new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(
                            old.components.map((component) => {
                                const newButton = discord.ButtonBuilder.from(component as discord.ButtonComponent);
                                if ((interaction.component as discord.ButtonComponent).customId === component.customId) {
                                    newButton.setStyle(
                                        (component as discord.ButtonComponent).style === discord.ButtonStyle.Primary
                                            ? discord.ButtonStyle.Secondary
                                            : discord.ButtonStyle.Primary
                                    );
                                }
                                return newButton;
                            })
                        )
                    );
                    interaction.update({ components: newActionRowComponents });
                });
                break;
            case "paginationtest":
                const p = new paginator.Paginator();
                p.addPage(new discord.EmbedBuilder().setTitle("Page 1").setDescription("This is page 1."));
                p.addPage(new discord.EmbedBuilder().setTitle("Page 2").setDescription("This is page 2."));
                p.addPage(new discord.EmbedBuilder().setTitle("Page 3").setDescription("This is page 3."));

                p.send(server.client.channels.cache.get("967427683506077767") as discord.TextChannel);
                break;
            case "appcmdlist":
                const commands = server.commands.map((command) => command.data.name);
                console.log(commands.join(", "));
                break;
            case "help":
                console.log("Available commands: exit, repl, reload, registerCommands, paginationTest, appcmdlist, help");
                break;
            default:
                server.echoError(`Unknown command "${command}". Type "help" for a list of commands.`);
                break;
        }
        rl.close();
        sendInput();
    });
};

server.registerEvent(discord.Events.ClientReady, () => {
    server.echoDebug(`Logged in as ${server.client.user?.tag} (${server.client.user?.id})!`);

    // write id to data/id.jsonc
    fs.writeFile(path.join(__dirname, "..", "..", "data", "id.jsonc"), JSON.stringify({ id: server.client.user?.id }));

    sendInput();
});
