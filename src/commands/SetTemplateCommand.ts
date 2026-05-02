import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class SetTemplateCommand extends BaseCommand {
  name = "set_template";
  description = "Configura la plantilla para los videos";
  usage = "/set_template [texto]";

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.message || !("text" in ctx.message)) return;

    const text = ctx.message.text.split(" ").slice(1).join(" ");

    if (!text) {
      await ctx.reply(
        "❌ Por favor, proporciona una plantilla.\n\n" +
          "Variables disponibles:\n" +
          "{username} - Nombre de usuario\n" +
          "{videoId} - ID del video\n" +
          "{url} - Enlace al video\n\n" +
          "Ejemplo: `/set_template 🔥 Nuevo de {username}! 🔗 {url}`",
        { parse_mode: "Markdown" },
      );
      return;
    }

    if (!ctx.from) return;

    await this.db.setTemplate(ctx.from.id, text);
    await ctx.reply("✅ Plantilla actualizada correctamente.");
  }
}

export default SetTemplateCommand;
