
const PQueue = require("p-queue").default;
const ClientWorker = require("./ClientWorker");

class System {
  constructor(db, tiktok, downloader, telegram) {
    this.db = db;
    this.tiktok = tiktok;
    this.downloader = downloader;
    this.telegram = telegram;
    this.workers = new Map();
    this.globalQueue = new PQueue({ concurrency: 3 });
  }

  async tick() {
    try {
      const clients = await this.db.getClients();
      for (const client of clients) {
        if (!this.workers.has(client.id)) {
          this.workers.set(client.id, new ClientWorker(client, this.globalQueue, this.db, this.tiktok, this.downloader, this.telegram));
        }

        const worker = this.workers.get(client.id);
        worker.run().catch(err => {
          console.error(`💥 Error en worker.run() para cliente ${client.id}:`, err);
        });
      }
    } catch (err) {
      console.error("💥 Error en System.tick():", err);
    }
  }

  start() {
    this.tick();
    setInterval(() => this.tick(), 300000);
  }
}

module.exports = System;
