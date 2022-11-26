import * as client from "../client.js";

client.registerEvent("ready", () => {
    console.log("Ready!");
}, true);
