const BaseCommand = require("./BaseCommand");

class HelpCommand extends BaseCommand {
  constructor(db, adminId) {
    super("help", db, adminId);
  }

  async execute(ctx) {
    const isAdmin = this.isAdmin(ctx);
    const isClient = await this.isClient(ctx);

    const args = ctx.message.text.split(" ").slice(1);

    if (args.length > 0) {
      const cmd = args[0].toLowerCase();

      const helpMap = {
        addclient: "👑 /addclient\nRegistra un cliente reenviando o respondiendo a su mensaje.",
        setlimit: "👑 /setlimit userId limit\nCambia el límite de cuentas de un cliente.",
        getid: "👑 /getid\nObtiene IDs de usuarios, chats, canales o mensajes.",
        setup: "📱 /setup\nInicia el proceso para agregar una cuenta de TikTok.",
        list: "📱 /list\nMuestra todas tus cuentas registradas.",
        delete: "📱 /delete username\nElimina una cuenta de TikTok.",
      };

      if (helpMap[cmd]) {
        return ctx.reply(helpMap[cmd]);
      }

      return ctx.reply("❌ Comando no encontrado");
    }

    let msg = "📖 AYUDA DEL BOT\n\n";

    if (isAdmin) {
      msg += `👑 ADMIN:\n
/addclient → Registrar cliente
/setlimit → Cambiar límite
/getid → Obtener IDs\n\n`;
    }

    if (isClient || isAdmin) {
      msg += `📱 CLIENTE:\n
/setup → Agregar cuenta TikTok
/list → Ver cuentas
/delete → Eliminar cuenta\n\n`;
    }

    msg += "💡 Usa /help comando para más info";

    ctx.reply(msg);
  }
}

module.exports = HelpCommand;
