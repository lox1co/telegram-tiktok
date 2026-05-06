import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class ClientCommand extends BaseCommand {
  name = "client";
  description = "Gestión de clientes (add, delete, limit, info)";
  usage = "/client [add | delete | limit | info]";
  adminOnly = true;

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.message || !("text" in ctx.message)) return;

    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) {
      await ctx.reply(
        "🛠 *GESTIÓN DE CLIENTES*\n\n" +
        "➕ `/client add` - Agregar nuevo cliente (vía reenvío)\n" +
        "🗑 `/client delete [id]` - Eliminar cliente\n" +
        "📏 `/client limit [id] [num]` - Cambiar límite de cuentas\n" +
        "ℹ️ `/client info [id]` - Ver detalles de un cliente",
        { parse_mode: "Markdown" }
      );
      return;
    }

    const sub = parts[1].toLowerCase();

    switch (sub) {
      case "add":
        if (parts.length < 4) {
          await ctx.reply("❌ Uso: `/client add [id] [nombre]`\nEjemplo: `/client add 12345678 Juan` ");
          return;
        }
        const newId = Number(parts[2]);
        const newName = parts.slice(3).join(" ");
        
        await this.db.addClientWithId(newId, newName);
        await ctx.reply(`✅ Cliente agregado:\n👤 *${newName}*\n🆔 ID: \`${newId}\``, { parse_mode: "Markdown" });
        break;

      case "delete":
        if (parts.length < 3) {
          await ctx.reply("❌ Uso: `/client delete [id]`");
          return;
        }
        const delId = Number(parts[2]);
        await this.db.deleteClient(delId);
        await ctx.reply(`🗑 Cliente con ID ${delId} eliminado.`);
        break;

      case "limit":
        if (parts.length < 4) {
          await ctx.reply("❌ Uso: `/client limit [id] [nuevo_limite]`");
          return;
        }
        const limId = parts[2];
        const newLim = Number(parts[3]);
        await this.db.setLimit(limId, newLim);
        await ctx.reply(`✅ Límite actualizado a ${newLim} para el cliente ${limId}.`);
        break;

      case "info":
        if (parts.length < 3) {
          await ctx.reply("❌ Uso: `/client info [id]`");
          return;
        }
        const infoId = Number(parts[2]);
        const client = await this.db.getClientById(infoId);
        if (!client) {
          await ctx.reply("❌ Cliente no encontrado en la base de datos.");
          return;
        }

        const stats = await this.db.getStats(infoId);
        const accounts = await this.db.getAccounts(infoId);

        let msg = `👤 *CLIENTE: ${client.name}*\n`;
        msg += `🆔 ID: \`${client.id}\`\n`;
        msg += `📏 Límite: ${stats.accounts} / ${client.account_limit}\n`;
        msg += `🎥 Videos enviados: ${stats.videos}\n\n`;

        if (accounts.length > 0) {
          msg += `📱 *Cuentas:* \n`;
          accounts.forEach((acc, i) => {
            msg += `${i + 1}. @${acc.username} (Channel: \`${acc.channel_id}\`)\n`;
          });
        } else {
          msg += `⚠️ Sin cuentas configuradas.`;
        }

        await ctx.reply(msg, { parse_mode: "Markdown" });
        break;

      default:
        await ctx.reply("❌ Subcomando no reconocido. Usa `/client` para ver la ayuda.");
    }
  }
}

export default ClientCommand;
