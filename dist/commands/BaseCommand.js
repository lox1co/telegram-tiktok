"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCommand {
    name;
    db;
    adminId;
    constructor(name, db, adminId) {
        this.name = name;
        this.db = db;
        this.adminId = adminId;
    }
    isAdmin(ctx) {
        return !!(ctx.from && ctx.from.id === this.adminId);
    }
    async getClient(ctx) {
        if (!ctx.from)
            return undefined;
        return await this.db.getClientById(ctx.from.id);
    }
    async isClient(ctx) {
        const c = await this.getClient(ctx);
        return !!c;
    }
}
exports.default = BaseCommand;
