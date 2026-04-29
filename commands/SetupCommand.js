const BaseCommand = require("./BaseCommand");

class SetupCommand extends BaseCommand {
  constructor(db, adminId) {
    super("setup", db, adminId);
  }

  async execute(ctx) {
    if (!(await this.isClient(ctx))) {
      return ctx.reply("❌ No eres cliente");
    }

    ctx.session.step = "username";
    ctx.reply("👤 Envíame el username de TikTok");
  }
}

module.exports = SetupCommand;
