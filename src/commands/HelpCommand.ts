import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class HelpCommand extends BaseCommand {
  name = "help";
  description = "Muestra la lista de comandos disponibles";
  usage = "/help [comando]";

  public allCommands: BaseCommand[] = [];

  async execute(ctx: BotContext): Promise<void> {
    if (!ctx.message || !("text" in ctx.message)) return;

    const args = ctx.message.text.split(" ").slice(1);

    if (args.length > 0) {
      const cmdName = args[0].toLowerCase().replace("/", "");
      const command = this.allCommands.find((c) => c.name === cmdName);

      if (command) {
        let helpMsg = `📖 Ayuda: /${command.name}\n\n`;
        helpMsg += `📝 Descripción: ${command.description}\n`;
        helpMsg += `💡 Uso: ${command.usage}`;
        if (command.adminOnly) helpMsg += `\n👑 Solo Administradores`;

        await ctx.reply(helpMsg);
        return;
      }

      await ctx.reply("❌ Comando no encontrado");
      return;
    }

    const isAdmin = ctx.from?.id === Number(process.env.ADMIN_ID);
    const isClient = await this.isClient(ctx);

    let msg = "📖 AYUDA DEL BOT\n\n";

    const adminCmds = this.allCommands.filter((c) => c.adminOnly);
    const publicCmds = this.allCommands.filter((c) => !c.adminOnly);

    if (isAdmin && adminCmds.length > 0) {
      msg += `👑 ADMIN:\n`;
      adminCmds.forEach((c) => {
        msg += `/${c.name} → ${c.description}\n`;
      });
      msg += `\n`;
    }

    if ((isClient || isAdmin) && publicCmds.length > 0) {
      msg += `📱 COMANDOS:\n`;
      publicCmds.forEach((c) => {
        msg += `/${c.name} → ${c.description}\n`;
      });
      msg += `\n`;
    }

    msg += "💡 Usa /help [comando] para más información.";

    await ctx.reply(msg);
  }
}

export default HelpCommand;
