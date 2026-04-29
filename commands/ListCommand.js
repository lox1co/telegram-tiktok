const BaseCommand = require("./BaseCommand");

class ListCommand extends BaseCommand {
  constructor(db, adminId) {
    super("list", db, adminId);
  }

  async execute(ctx) {
    if (!(await this.isClient(ctx))) return;

    const accounts = await this.db.getAccounts(ctx.from.id);

    if (!accounts.length) return ctx.reply("📭 Sin cuentas");

    let msg = "📋 Tus cuentas:\n\n";
    accounts.forEach((a) => {
      msg += `• @${a.username} → ${a.channel_id}\n`;
    });

    ctx.reply(msg);
  }
}

module.exports = ListCommand;
