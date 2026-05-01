import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class SetLimitCommand extends BaseCommand {
  name = "setlimit";
  description = "Cambia el límite de cuentas de un cliente";
  usage = "/setlimit userId limit";
  adminOnly = true;

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.message || !("text" in ctx.message)) return;

    const parts = ctx.message.text.split(" ");

    if (parts.length < 3) {
      await ctx.reply("Uso: /setlimit userId limit");
      return;
    }

    await this.db.setLimit(parts[1], parts[2]);

    await ctx.reply("✅ Límite actualizado");
  }
}

export default SetLimitCommand;
