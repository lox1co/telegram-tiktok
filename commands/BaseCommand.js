class BaseCommand {
  constructor(name, db, adminId) {
    this.name = name;
    this.db = db;
    this.adminId = adminId;
  }

  isAdmin(ctx) {
    return ctx.from && ctx.from.id === this.adminId;
  }

  async getClient(ctx) {
    return await this.db.getClientById(ctx.from.id);
  }

  async isClient(ctx) {
    const c = await this.getClient(ctx);
    return !!c;
  }

  async execute(ctx) {
    throw new Error("Method 'execute()' must be implemented.");
  }
}

module.exports = BaseCommand;
