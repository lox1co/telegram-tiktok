const BaseCommand = require("./BaseCommand");

class AddClientCommand extends BaseCommand {
  constructor(db, adminId) {
    super("addclient", db, adminId);
  }

  async execute(ctx) {
    if (!this.isAdmin(ctx)) return;

    ctx.session.step = "addclient";
    ctx.reply("📩 Reenvía o responde a un mensaje del usuario");
  }
}

module.exports = AddClientCommand;
