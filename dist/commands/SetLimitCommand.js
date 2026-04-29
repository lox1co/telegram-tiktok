"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class SetLimitCommand extends BaseCommand_1.default {
    constructor(db, adminId) {
        super("setlimit", db, adminId);
    }
    async execute(ctx) {
        if (!this.isAdmin(ctx))
            return;
        if (!ctx.message || !('text' in ctx.message))
            return;
        const parts = ctx.message.text.split(" ");
        if (parts.length < 3) {
            await ctx.reply("Uso: /setlimit userId limit");
            return;
        }
        await this.db.setLimit(parts[1], parts[2]);
        await ctx.reply("✅ Límite actualizado");
    }
}
exports.default = SetLimitCommand;
