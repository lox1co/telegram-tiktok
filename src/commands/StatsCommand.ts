import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class StatsCommand extends BaseCommand {
  name = "stats";
  description = "Muestra estadísticas de uso";
  usage = "/stats";

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.from) return;

    const isAdmin = ctx.from.id === Number(process.env.ADMIN_ID);
    const stats = await this.db.getStats(ctx.from.id);
    const client = await this.db.getClientById(ctx.from.id);

    let msg = "📊 *ESTADÍSTICAS*\n\n";
    
    if (client || isAdmin) {
      msg += `👤 *Tus Datos:*\n`;
      msg += `👥 Cuentas: ${stats.accounts}${client ? " / " + client.account_limit : ""}\n`;
      msg += `🎥 Videos enviados: ${stats.videos}\n\n`;
    }

    if (isAdmin) {
      const global = await this.db.getGlobalStats();
      msg += `🌐 *Globales (Admin):*\n`;
      msg += `👥 Total Clientes: ${global.totalClients}\n`;
      msg += `📱 Total Cuentas: ${global.totalAccounts}\n`;
      msg += `🎥 Total Videos: ${global.totalVideos}\n`;
    }

    if (!client && !isAdmin) {
      msg = "❌ No estás registrado como cliente.";
    }

    await ctx.reply(msg, { parse_mode: "Markdown" });
  }
}

export default StatsCommand;
