import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class DeleteCommand extends BaseCommand {
  name = "delete";
  description = "Elimina una cuenta de TikTok registrada";
  usage = "/delete username";

  async execute(ctx: BotContext): Promise<void> {
    if (!(await this.isClient(ctx))) return;

    if (!ctx.message || !("text" in ctx.message) || !ctx.from) return;

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

export default DeleteCommand;
