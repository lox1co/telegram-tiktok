"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class DeleteCommand extends BaseCommand_1.default {
    constructor(db, adminId) {
        super("delete", db, adminId);
    }
    async execute(ctx) {
        if (!(await this.isClient(ctx)))
            return;
        if (!ctx.message || !('text' in ctx.message) || !ctx.from)
            return;
        const parts = ctx.message.text.split(" ");
        if (parts.length < 2) {
            await ctx.reply("Uso: /delete username");
            return;
        }
        const user = parts[1];
        await this.db.deleteAccount(user, ctx.from.id);
        await ctx.reply("🗑 Eliminado");
    }
}
exports.default = DeleteCommand;
