"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_queue_1 = __importDefault(require("p-queue"));
const ClientWorker_1 = __importDefault(require("./ClientWorker"));
class System {
    db;
    tiktok;
    downloader;
    telegram;
    workers;
    globalQueue;
    constructor(db, tiktok, downloader, telegram) {
        this.db = db;
        this.tiktok = tiktok;
        this.downloader = downloader;
        this.telegram = telegram;
        this.workers = new Map();
        this.globalQueue = new p_queue_1.default({ concurrency: 3 });
    }
    async tick() {
        try {
            const clients = await this.db.getClients();
            for (const client of clients) {
                if (!this.workers.has(client.id)) {
                    this.workers.set(client.id, new ClientWorker_1.default(client, this.globalQueue, this.db, this.tiktok, this.downloader, this.telegram));
                }
                const worker = this.workers.get(client.id);
                if (worker) {
                    worker.run().catch((err) => {
                        console.error(`💥 Error en worker.run() para cliente ${client.id}:`, err);
                    });
                }
            }
        }
        catch (err) {
            console.error("💥 Error en System.tick():", err);
        }
    }
    start() {
        this.tick();
        setInterval(() => this.tick(), 300000);
    }
}
exports.default = System;
