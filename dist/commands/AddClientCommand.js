"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class AddClientCommand extends BaseCommand_1.default {
    constructor(db, adminId) {
        super("addclient", db, adminId);
    }
    async execute(ctx) {
        if (!this.isAdmin(ctx))
            return;
        ctx.session.step = "addclient";
        await ctx.reply("📩 Reenvía o responde a un mensaje del usuario");
    }
}
exports.default = AddClientCommand;
