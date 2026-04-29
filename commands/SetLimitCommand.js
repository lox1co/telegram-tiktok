const BaseCommand = require("./BaseCommand");

class SetLimitCommand extends BaseCommand {
  constructor(db, adminId) {
    super("setlimit", db, adminId);
  }

  async execute(ctx) {
    if (!this.isAdmin(ctx)) return;

    const parts = ctx.message.text.split(" ");

    if (parts.length < 3) {
      return ctx.reply("Uso: /setlimit userId limit");
    }

    await this.db.setLimit(parts[1], parts[2]);

    ctx.reply("✅ Límite actualizado");
  }
}

module.exports = SetLimitCommand;
