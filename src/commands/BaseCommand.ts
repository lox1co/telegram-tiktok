import Database from "../db/database";
import { BotContext, Client, Command } from "../types";

import DownloaderService from "../services/DownloaderService";

abstract class BaseCommand implements Command {
  public abstract name: string;
  public abstract description: string;
  public abstract usage: string;
  public adminOnly: boolean = false;

  public db!: Database;
  public downloader!: DownloaderService;

  async getClient(ctx: BotContext): Promise<Client | undefined> {
    if (!ctx.from) return undefined;
    return await this.db.getClientById(ctx.from.id);
  }

  async isClient(ctx: BotContext): Promise<boolean> {
    const c = await this.getClient(ctx);
    return !!c;
  }

  abstract execute(ctx: BotContext): Promise<void>;
}

export default BaseCommand;
