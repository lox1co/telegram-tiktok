import BaseCommand from "./BaseCommand";
import { BotContext } from "../types";

class PingCommand extends BaseCommand {
  name = "ping";
  description = "Verifica si el bot está respondiendo";
  usage = "/ping";
  adminOnly = false;

  async execute(ctx: BotContext): Promise<void> {
    const start = Date.now();
    const msg = await ctx.reply("🏓 Pong!");
    const end = Date.now();
    const latency = end - start;
    
    if (!ctx.chat) return;

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      msg.message_id,
      undefined,
      `🏓 Pong!\nLatencia: ${latency}ms`
    );
  }
}

export default PingCommand;
