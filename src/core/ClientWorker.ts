import PQueue from "p-queue";
import Database from "../db/database";
import TikTokService from "../services/TikTokService";
import DownloaderService from "../services/DownloaderService";
import TelegramService from "../services/TelegramService";
import { Client, Account } from "../types";

class ClientWorker {
  private client: Client;
  private queue: PQueue;
  private db: Database;
  private tiktok: TikTokService;
  private downloader: DownloaderService;
  private telegram: TelegramService;

  constructor(
    client: Client,
    globalQueue: PQueue,
    db: Database,
    tiktok: TikTokService,
    downloader: DownloaderService,
    telegram: TelegramService,
  ) {
    this.client = client;
    this.queue = globalQueue;
    this.db = db;
    this.tiktok = tiktok;
    this.downloader = downloader;
    this.telegram = telegram;
  }

  async run(): Promise<void> {
    const accounts = await this.db.getAccounts(this.client.id);
    const template = await this.db.getTemplate(this.client.id);

    await Promise.all(
      accounts.map(async (acc) => {
        try {
          const videos = await this.tiktok.getVideos(acc.username, 7);

          for (const id of [...videos].reverse()) {
            this.queue.add(() => this.processVideo(acc, id, template));
          }
        } catch (err) {
          console.error(`❌ Error al obtener videos para @${acc.username}`, err);
        }
      })
    );
  }

  async processVideo(account: Account, videoId: string, template?: string, attempt: number = 1): Promise<void> {
    const MAX_RETRIES = 3;

    try {
      const sent = await this.db.isSent(videoId, this.client.id);
      if (sent) return;

      const file = await this.downloader.download(videoId, this.client.id, account.username);

      let caption: string | undefined;
      if (template) {
        caption = template
          .replace(/{username}/g, account.username)
          .replace(/{videoId}/g, videoId)
          .replace(/{url}/g, `https://www.tiktok.com/@${account.username}/video/${videoId}`);
      }

      await this.telegram.send(account.channel_id, file, account.username, videoId, account.thread_id, caption);

      await this.db.markSent(videoId, this.client.id);
      this.downloader.delete(file);
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        setTimeout(() => {
          this.queue.add(() => this.processVideo(account, videoId, template, attempt + 1));
        }, 5000 * attempt);
      } else {
        console.log(`❌ Cliente ${this.client.id} intento ${attempt}`, err);
      }
    }
  }
}

export default ClientWorker;
