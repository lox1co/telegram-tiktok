import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class GetIdCommand extends BaseCommand {
  constructor(db: Database, adminId: number) {
    super("getid", db, adminId);
  }

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.chat || !ctx.from) return;

    let msg = `💬 Chat ID: ${ctx.chat.id}\n👤 Tu ID: ${ctx.from.id}`;

    if (ctx.message && 'reply_to_message' in ctx.message && ctx.message.reply_to_message && 'from' in ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
      msg += `\n↩️ Reply ID: ${ctx.message.reply_to_message.from.id}`;
    }

    if (ctx.message && 'forward_from' in ctx.message && ctx.message.forward_from) {
      msg += `\n🔁 Forward User: ${(ctx.message.forward_from as any).id}`;
    }

    if (ctx.message && 'forward_from_chat' in ctx.message && ctx.message.forward_from_chat) {
      msg += `\n🔁 Forward Chat: ${(ctx.message.forward_from_chat as any).id}`;
    }

    await ctx.reply(msg);
  }
}

export default GetIdCommand;
