import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class StatsCommand extends BaseCommand {
  name = "stats";
  description = "Muestra estadísticas de uso";
  usage = "/stats";

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.from) return;

    const stats = await this.db.getStats(ctx.from.id);
    const client = await this.db.getClientById(ctx.from.id);

    let msg = "📊 ESTADÍSTICAS\n\n";
    msg += `👥 Cuentas monitoreadas: ${stats.accounts}${client ? " / " + client.account_limit : ""}\n`;
    msg += `🎥 Videos enviados: ${stats.videos}\n`;

    await ctx.reply(msg);
  }
}

export default StatsCommand;
