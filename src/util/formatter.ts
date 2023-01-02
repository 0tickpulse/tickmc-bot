import * as discord from "discord.js";
export function formatUser(user: discord.User) {
    return `${user.tag} (${user.id})`;
}