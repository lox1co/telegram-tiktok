import PQueue from "p-queue";
import ClientWorker from "./ClientWorker";
import Database from "../db/database";
import TikTokService from "../services/TikTokService";
import DownloaderService from "../services/DownloaderService";
import TelegramService from "../services/TelegramService";

class System {
  private db: Database;
  private tiktok: TikTokService;
  private downloader: DownloaderService;
  private telegram: TelegramService;
  private workers: Map<number, ClientWorker>;
  private globalQueue: PQueue;

  constructor(db: Database, tiktok: TikTokService, downloader: DownloaderService, telegram: TelegramService) {
    this.db = db;
    this.tiktok = tiktok;
    this.downloader = downloader;
    this.telegram = telegram;
    this.workers = new Map();
    this.globalQueue = new PQueue({ concurrency: 3 });
  }

  async tick(): Promise<void> {
    try {
      const clients = await this.db.getClients();
      for (const client of clients) {
        if (!this.workers.has(client.id)) {
          this.workers.set(client.id, new ClientWorker(client, this.globalQueue, this.db, this.tiktok, this.downloader, this.telegram));
        }

        const worker = this.workers.get(client.id);
        if (worker) {
          worker.run().catch((err: Error) => {
            console.error(`💥 Error en worker.run() para cliente ${client.id}:`, err);
          });
        }
      }
    } catch (err) {
      console.error("💥 Error en System.tick():", err);
    }
  }

  start(): void {
    this.tick();
    setInterval(() => this.tick(), 300000);
  }
}

export default System;
