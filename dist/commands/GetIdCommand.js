"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class GetIdCommand extends BaseCommand_1.default {
    constructor(db, adminId) {
        super("getid", db, adminId);
    }
    async execute(ctx) {
        if (!ctx.chat || !ctx.from)
            return;
        let msg = `💬 Chat ID: ${ctx.chat.id}\n👤 Tu ID: ${ctx.from.id}`;
        if (ctx.message && 'reply_to_message' in ctx.message && ctx.message.reply_to_message && 'from' in ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
            msg += `\n↩️ Reply ID: ${ctx.message.reply_to_message.from.id}`;
        }
        if (ctx.message && 'forward_from' in ctx.message && ctx.message.forward_from) {
            msg += `\n🔁 Forward User: ${ctx.message.forward_from.id}`;
        }
        if (ctx.message && 'forward_from_chat' in ctx.message && ctx.message.forward_from_chat) {
            msg += `\n🔁 Forward Chat: ${ctx.message.forward_from_chat.id}`;
        }
        await ctx.reply(msg);
    }
}
exports.default = GetIdCommand;
