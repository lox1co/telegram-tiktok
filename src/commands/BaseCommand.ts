import Database from "../db/database";
import { BotContext, Client, Command } from "../types";

abstract class BaseCommand implements Command {
  public name: string;
  protected db: Database;
  protected adminId: number;

  constructor(name: string, db: Database, adminId: number) {
    this.name = name;
    this.db = db;
    this.adminId = adminId;
  }

  isAdmin(ctx: BotContext): boolean {
    return !!(ctx.from && ctx.from.id === this.adminId);
  }

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
