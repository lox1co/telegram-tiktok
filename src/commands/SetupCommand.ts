import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class SetupCommand extends BaseCommand {
  name = "setup";
  description = "Inicia el proceso para agregar una cuenta de TikTok";
  usage = "/setup";

  async execute(ctx: BotContext): Promise<void> {
    if (!(await this.isClient(ctx))) {
      await ctx.reply("❌ No eres cliente");
      return;
    }

    if (!ctx.chat) {
      await ctx.reply("❌ Este comando solo puede usarse en chats (grupos, canales o privado)");
      return;
    }

    ctx.session.temp = {
      channel: ctx.chat.id.toString(),
      threadId: ctx.message && "message_thread_id" in ctx.message ? ctx.message.message_thread_id : undefined,
    };

    ctx.session.step = "username";
    await ctx.reply("👤 Envíame el username de TikTok");
  }
}

export default SetupCommand;
