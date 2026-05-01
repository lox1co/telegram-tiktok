import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class AddClientCommand extends BaseCommand {
  name = "addclient";
  description = "Registra un cliente reenviando o respondiendo a su mensaje";
  usage = "/addclient";
  adminOnly = true;

  async execute(ctx: BotContext): Promise<void> {
    ctx.session.step = "addclient";
    await ctx.reply("📩 Reenvía o responde a un mensaje del usuario");
  }
}

export default AddClientCommand;
