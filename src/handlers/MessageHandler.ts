import Database from "../db/database";
import { BotContext } from "../types";

class MessageHandler {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async handle(ctx: BotContext): Promise<void> {
    if (!ctx.session.step) return;

    if (ctx.session.step === "addclient") {
      let user: any = ctx.message && "forward_from" in ctx.message ? ctx.message.forward_from : null;
      if (
        !user &&
        ctx.message &&
        "reply_to_message" in ctx.message &&
        ctx.message.reply_to_message &&
        "from" in ctx.message.reply_to_message
      ) {
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

    if (ctx.session.step === "username" && ctx.from) {
      if (ctx.message && "text" in ctx.message) {
        ctx.session.temp.username = ctx.message.text;
      }

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

      const { username, channel, threadId } = ctx.session.temp;

      if (!username || !channel) {
        await ctx.reply("❌ Error: faltan datos de configuración (chat/topic no detectado)");
        return;
      }

      await this.db.addAccount({
        username,
        channel_id: channel,
        thread_id: threadId?.toString(),
        client_id: ctx.from.id,
      });

      await ctx.reply(`✅ Cuenta @${username} configurada correctamente en este ${threadId ? "tema" : "chat"}.`);

      ctx.session.step = null;
      ctx.session.temp = {};
    }
  }
}

export default MessageHandler;
