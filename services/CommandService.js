const { Telegraf } = require("telegraf");

class CommandService {
  constructor(token, db, commands, messageHandler) {
    this.bot = new Telegraf(token);
    this.db = db;
    this.commands = commands;
    this.messageHandler = messageHandler;

    this.bot.use(async (ctx, next) => {
      const id = ctx.from ? ctx.from.id.toString() : null;
      if (!id) return next();

      let data;
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

  registerCommands() {
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

  launch() {
    this.bot.launch();
  }
}

module.exports = CommandService;
