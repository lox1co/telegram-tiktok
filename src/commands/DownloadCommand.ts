import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class DownloadCommand extends BaseCommand {
  name = "download";
  description = "Descarga un video pasando la URL";
  usage = "/download <url>";
  adminOnly = false;

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.message || !("text" in ctx.message)) return;

    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) {
      await ctx.reply("❌ Debes proporcionar una URL. Ejemplo: /download https://...");
      return;
    }

    const url = parts[1];
    const clientId = ctx.from?.id || 0;

    const waitMsg = await ctx.reply("⏳ Descargando video, por favor espera...");

    try {
      // url acts as videoId, downloader handles formatting URL internally if it starts with http
      const filePath = await this.downloader.download(url, clientId, "unknown");

      // Send the file back to the user
      await ctx.replyWithVideo({ source: filePath }, { caption: `🎥 Video descargado:\n${url}` });
      
      // Cleanup
      this.downloader.delete(filePath);

      // Delete wait message
      if (ctx.chat) {
        await ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id).catch(() => {});
      }
    } catch (err: any) {
      console.error("Error en DownloadCommand:", err);
      
      if (ctx.chat) {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          waitMsg.message_id,
          undefined,
          "❌ Ocurrió un error al intentar descargar el video. Verifica que el enlace sea válido."
        ).catch(() => {});
      }
    }
  }
}

export default DownloadCommand;
