class MessageHandler {
  constructor(db) {
    this.db = db;
  }

  async handle(ctx) {
    if (!ctx.session.step) return;

    if (ctx.session.step === "addclient") {
      let user = ctx.message.forward_from || ctx.message.reply_to_message?.from;

      if (!user) return ctx.reply("❌ No se pudo obtener usuario");

      await this.db.addClientWithId(user.id, user.first_name);

      ctx.reply(`✅ Cliente agregado\n${user.first_name}\nID: ${user.id}`);

      ctx.session.step = null;
      return;
    }

    if (ctx.session.step === "username") {
      ctx.session.temp.username = ctx.message.text;
      ctx.session.step = "channel";

      ctx.reply("📢 Reenvía mensaje del canal o escribe ID");
      return;
    }

    if (ctx.session.step === "channel") {
      const client = await this.db.getClientById(ctx.from.id);
      const accounts = await this.db.getAccounts(ctx.from.id);

      if (accounts.length >= client.account_limit) {
        return ctx.reply("⚠️ Límite alcanzado");
      }

      const channel = ctx.message.forward_from_chat?.id || ctx.message.text;

      await this.db.addAccount({
        username: ctx.session.temp.username,
        channel_id: channel,
        client_id: ctx.from.id,
      });

      ctx.reply("✅ Cuenta agregada");

      ctx.session.step = null;
      ctx.session.temp = {};
    }
  }
}

module.exports = MessageHandler;
