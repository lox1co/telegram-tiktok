"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class SetupCommand extends BaseCommand_1.default {
    constructor(db, adminId) {
        super("setup", db, adminId);
    }
    async execute(ctx) {
        if (!(await this.isClient(ctx))) {
            await ctx.reply("❌ No eres cliente");
            return;
        }
        ctx.session.step = "username";
        await ctx.reply("👤 Envíame el username de TikTok");
    }
}
exports.default = SetupCommand;
