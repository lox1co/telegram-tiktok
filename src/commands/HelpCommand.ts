import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class HelpCommand extends BaseCommand {
  constructor(db: Database, adminId: number) {
    super("help", db, adminId);
  }

  async execute(ctx: BotContext): Promise<void> {
    const isAdmin = this.isAdmin(ctx);
    const isClient = await this.isClient(ctx);

    if (!ctx.message || !('text' in ctx.message)) return;

    const args = ctx.message.text.split(" ").slice(1);

    if (args.length > 0) {
      const cmd = args[0].toLowerCase();

      const helpMap: Record<string, string> = {
        addclient: "👑 /addclient\nRegistra un cliente reenviando o respondiendo a su mensaje.",
        setlimit: "👑 /setlimit userId limit\nCambia el límite de cuentas de un cliente.",
        getid: "👑 /getid\nObtiene IDs de usuarios, chats, canales o mensajes.",
        setup: "📱 /setup\nInicia el proceso para agregar una cuenta de TikTok.",
        list: "📱 /list\nMuestra todas tus cuentas registradas.",
        delete: "📱 /delete username\nElimina una cuenta de TikTok.",
      };

      if (helpMap[cmd]) {
        await ctx.reply(helpMap[cmd]);
        return;
      }

      await ctx.reply("❌ Comando no encontrado");
      return;
    }

    let msg = "📖 AYUDA DEL BOT\n\n";

    if (isAdmin) {
      msg += `👑 ADMIN:\n\n/addclient → Registrar cliente\n/setlimit → Cambiar límite\n/getid → Obtener IDs\n\n`;
    }

    if (isClient || isAdmin) {
      msg += `📱 CLIENTE:\n\n/setup → Agregar cuenta TikTok\n/list → Ver cuentas\n/delete → Eliminar cuenta\n\n`;
    }

    msg += "💡 Usa /help comando para más info";

    await ctx.reply(msg);
  }
}

export default HelpCommand;
