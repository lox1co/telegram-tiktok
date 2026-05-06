import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class ActiveCommand extends BaseCommand {
  name = "active";
  description = "Lista todos los clientes con cuentas configuradas";
  usage = "/active";
  adminOnly = true;

  async execute(ctx: BotContext): Promise<void> {
    const clients = await this.db.getClients();
    let msg = "👥 *CLIENTES ACTIVOS*\n\n";

    let count = 0;
    for (const client of clients) {
      const accounts = await this.db.getAccounts(client.id);
      if (accounts.length > 0) {
        msg += `🔹 *${client.name}* (ID: ${client.id})\n`;
        msg += `   📍 Cuentas: ${accounts.length}\n`;
        msg += `   📄 Plantilla: ${client.template ? "✅" : "❌"}\n\n`;
        count++;
      }
    }

    if (count === 0) {
      msg = "❌ No hay clientes con cuentas configuradas.";
    } else {
        msg += `Total: ${count} clientes activos.`;
    }

    await ctx.reply(msg, { parse_mode: "Markdown" });
  }
}

export default ActiveCommand;
