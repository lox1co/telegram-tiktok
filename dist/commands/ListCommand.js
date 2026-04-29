"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class ListCommand extends BaseCommand_1.default {
    constructor(db, adminId) {
        super("list", db, adminId);
    }
    async execute(ctx) {
        if (!(await this.isClient(ctx)))
            return;
        if (!ctx.from)
            return;
        const accounts = await this.db.getAccounts(ctx.from.id);
        if (!accounts.length) {
            await ctx.reply("📭 Sin cuentas");
            return;
        }
        let msg = "📋 Tus cuentas:\n\n";
        accounts.forEach((a) => {
            msg += `• @${a.username} → ${a.channel_id}\n`;
        });
        await ctx.reply(msg);
    }
}
exports.default = ListCommand;
