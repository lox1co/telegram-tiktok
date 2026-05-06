import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class BroadcastCommand extends BaseCommand {
  name = "broadcast";
  description = "Envía un mensaje a todos los clientes registrados";
  usage = "/broadcast [mensaje]";
  adminOnly = true;

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.message || !("text" in ctx.message)) return;

    const messageText = ctx.message.text.split(" ").slice(1).join(" ");

    if (!messageText) {
      await ctx.reply("❌ Debes proporcionar un mensaje. Uso: /broadcast [mensaje]");
      return;
    }

    const clients = await this.db.getClients();
    let successCount = 0;
    let failCount = 0;

    const statusMsg = await ctx.reply(`📣 Enviando mensaje a ${clients.length} clientes...`);

    for (const client of clients) {
      try {
        await ctx.telegram.sendMessage(client.id, `📢 *MENSAJE DEL ADMINISTRADOR*\n\n${messageText}`, {
          parse_mode: "Markdown",
        });
        successCount++;
      } catch (err) {
        failCount++;
      }
    }

    await ctx.telegram.editMessageText(
      ctx.chat?.id!,
      statusMsg.message_id,
      undefined,
      `✅ Difusión completada\n\nEnviados: ${successCount}\nFallidos: ${failCount}`
    );
  }
}

export default BroadcastCommand;
