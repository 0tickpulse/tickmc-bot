import { User } from "discord.js";
import * as fs from "fs/promises";
import * as sql from "sqlite3";
import * as path from "path";
import { echoError } from "../server";
import { ObjectValues } from "../util/enums";

const WARNING_SEVERITY = {
    Minor: "minor",
    Normal: "normal",
    Serious: "serious",
    InstantMute: "instantmute",
    InstantBan: "instantban"
} as const;3

export type WarningSeverity = ObjectValues<typeof WARNING_SEVERITY>;

export type Warning = {
    case: number;
    user: User;
    moderator?: User;
    reason?: string;
    severity: WarningSeverity;
};

export function warnUser(warning: Warning) {
    const db = new sql.Database(path.join(__dirname, "..", "..", "data", "warnings.db"));
    if (!db) {
        echoError("Failed to open database. Creating new database and trying again...");
        fs.writeFile(path.join(__dirname, "..", "..", "data", "warnings.db"), "");
        warnUser(warning);
    }
    // check if the table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='warnings'", (err, row) => {
        if (err) {
            echoError(err.toString());
            return;
        }
        if (!row) {
            // create table
            db.run("CREATE TABLE warnings (case INTEGER PRIMARY KEY, user TEXT, moderator TEXT, reason TEXT, severity TEXT)", (err) => {
                if (err) {
                    echoError(err.toString());
                    return;
                }
                console.log("Created warnings table.");
            });
        }
    });
    // get the case
    db.get("SELECT MAX(case) AS case FROM warnings", (err, row) => {
        if (err) {
            echoError(err.toString());
            return;
        }
        const caseNumber = row.case + 1 ?? 1;
        db.run(
            "INSERT INTO warnings (case, user, moderator, reason, severity) VALUES (?, ?, ?, ?, ?)",
            [caseNumber, warning.user.id, warning.moderator?.id ?? "none", warning.reason, warning.severity],
            (err) => {
                if (err) {
                    echoError(err.toString());
                    return;
                }
                console.log(`[Case ${caseNumber}] Warned user ${warning.user.tag} with severity ${warning.severity} for: ${warning.reason}.`);
            }
        );
    });
}
