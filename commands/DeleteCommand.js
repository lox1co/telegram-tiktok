const BaseCommand = require("./BaseCommand");

class DeleteCommand extends BaseCommand {
  constructor(db, adminId) {
    super("delete", db, adminId);
  }

  async execute(ctx) {
    if (!(await this.isClient(ctx))) return;

    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) {
      return ctx.reply("Uso: /delete username");
    }
    const user = parts[1];

    await this.db.deleteAccount(user, ctx.from.id);

    ctx.reply("🗑 Eliminado");
  }
}

module.exports = DeleteCommand;
