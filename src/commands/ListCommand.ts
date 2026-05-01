import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class ListCommand extends BaseCommand {
  name = "list";
  description = "Muestra todas tus cuentas de TikTok registradas";
  usage = "/list";

  async execute(ctx: BotContext): Promise<void> {
    if (!(await this.isClient(ctx))) return;

    if (!ctx.from) return;

    const accounts = await this.db.getAccounts(ctx.from.id);

    if (!accounts.length) {
      await ctx.reply("📭 Sin cuentas");
      return;
    }

    let msg = "📋 Tus cuentas:\n\n";
    accounts.forEach((a) => {
      msg += `• @${a.username} → ${a.channel_id}\n`;
    });

    await ctx.reply(msg);
  }
}

export default ListCommand;
