"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageHandler {
    db;
    constructor(db) {
        this.db = db;
    }
    async handle(ctx) {
        if (!ctx.session.step)
            return;
        if (ctx.session.step === "addclient") {
            let user = ctx.message && 'forward_from' in ctx.message ? ctx.message.forward_from : null;
            if (!user && ctx.message && 'reply_to_message' in ctx.message && ctx.message.reply_to_message && 'from' in ctx.message.reply_to_message) {
                user = ctx.message.reply_to_message.from;
            }
            if (!user) {
                await ctx.reply("❌ No se pudo obtener usuario");
                return;
            }
            await this.db.addClientWithId(user.id, user.first_name);
            await ctx.reply(`✅ Cliente agregado\n${user.first_name}\nID: ${user.id}`);
            ctx.session.step = null;
            return;
        }
        if (ctx.session.step === "username") {
            if (ctx.message && 'text' in ctx.message) {
                ctx.session.temp.username = ctx.message.text;
            }
            ctx.session.step = "channel";
            await ctx.reply("📢 Reenvía mensaje del canal o escribe ID");
            return;
        }
        if (ctx.session.step === "channel" && ctx.from) {
            const client = await this.db.getClientById(ctx.from.id);
            if (!client) {
                await ctx.reply("❌ Cliente no encontrado");
                return;
            }
            const accounts = await this.db.getAccounts(ctx.from.id);
            if (accounts.length >= client.account_limit) {
                await ctx.reply("⚠️ Límite alcanzado");
                return;
            }
            let channel;
            if (ctx.message && 'forward_from_chat' in ctx.message && ctx.message.forward_from_chat) {
                channel = ctx.message.forward_from_chat.id;
            }
            else if (ctx.message && 'text' in ctx.message) {
                channel = ctx.message.text;
            }
            if (!channel || !ctx.session.temp.username) {
                await ctx.reply("❌ Error leyendo canal o username");
                return;
            }
            await this.db.addAccount({
                username: ctx.session.temp.username,
                channel_id: channel.toString(),
                client_id: ctx.from.id,
            });
            await ctx.reply("✅ Cuenta agregada");
            ctx.session.step = null;
            ctx.session.temp = {};
        }
    }
}
exports.default = MessageHandler;
