const BaseCommand = require("./BaseCommand");

class GetIdCommand extends BaseCommand {
  constructor(db, adminId) {
    super("getid", db, adminId);
  }

  async execute(ctx) {
    let msg = `💬 Chat ID: ${ctx.chat.id}\n👤 Tu ID: ${ctx.from.id}`;

    if (ctx.message.reply_to_message?.from) {
      msg += `\n↩️ Reply ID: ${ctx.message.reply_to_message.from.id}`;
    }

    if (ctx.message.forward_from) {
      msg += `\n🔁 Forward User: ${ctx.message.forward_from.id}`;
    }

    if (ctx.message.forward_from_chat) {
      msg += `\n🔁 Forward Chat: ${ctx.message.forward_from_chat.id}`;
    }

    ctx.reply(msg);
  }
}

module.exports = GetIdCommand;
