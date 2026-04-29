import { Telegraf } from "telegraf";
import Database from "../db/database";
import MessageHandler from "../handlers/MessageHandler";
import { Command, BotContext, SessionData } from "../types";

class BotService {
  private bot: Telegraf<BotContext>;
  private db: Database;
  private commands: Command[];
  private messageHandler: MessageHandler;

  constructor(token: string, db: Database, commands: Command[], messageHandler: MessageHandler) {
    this.bot = new Telegraf<BotContext>(token);
    this.db = db;
    this.commands = commands;
    this.messageHandler = messageHandler;

    this.bot.use(async (ctx, next) => {
      const id = ctx.from ? ctx.from.id.toString() : null;
      if (!id) return next();

      let data: SessionData | null = null;
      try {
        data = await this.db.getSession(id);
      } catch (err) {
        console.error("Error reading session:", err);
      }

      if (!data) {
        data = { step: null, temp: {} };
      }
      ctx.session = data;

      await next();

      try {
        await this.db.saveSession(id, ctx.session);
      } catch (err) {
        console.error("Error saving session:", err);
      }
    });

    this.bot.catch((err, ctx) => {
      console.error(`💥 Error en bot para ${ctx.updateType}:`, err);
      ctx.reply("❌ Ocurrió un error inesperado al procesar tu solicitud.").catch(() => {});
    });

    this.registerCommands();
  }

  private registerCommands(): void {
    for (const command of this.commands) {
      this.bot.command(command.name, async (ctx) => {
        try {
          await command.execute(ctx);
        } catch (err) {
          console.error(`Error ejecutando comando ${command.name}:`, err);
          ctx.reply("❌ Ocurrió un error al ejecutar el comando.").catch(() => {});
        }
      });
    }

    this.bot.on("text", async (ctx) => {
      try {
        await this.messageHandler.handle(ctx);
      } catch (err) {
        console.error("Error en MessageHandler:", err);
        ctx.reply("❌ Error al procesar tu mensaje.").catch(() => {});
      }
    });
  }

  public launch(): void {
    this.bot.launch();
  }
}

export default BotService;
