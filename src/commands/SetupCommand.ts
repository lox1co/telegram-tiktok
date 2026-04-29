import BaseCommand from "./BaseCommand";
import Database from "../db/database";
import { BotContext } from "../types";

class SetupCommand extends BaseCommand {
  constructor(db: Database, adminId: number) {
    super("setup", db, adminId);
  }

  async execute(ctx: BotContext): Promise<void> {
    if (!(await this.isClient(ctx))) {
      await ctx.reply("❌ No eres cliente");
      return;
    }

    ctx.session.step = "username";
    await ctx.reply("👤 Envíame el username de TikTok");
  }
}

export default SetupCommand;
