import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class AddClientCommand extends BaseCommand {
  constructor(db: Database, adminId: number) {
    super("addclient", db, adminId);
  }

  async execute(ctx: BotContext): Promise<void> {
    if (!this.isAdmin(ctx)) return;

    ctx.session.step = "addclient";
    await ctx.reply("📩 Reenvía o responde a un mensaje del usuario");
  }
}

export default AddClientCommand;
