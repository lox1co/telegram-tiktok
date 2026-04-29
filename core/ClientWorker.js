
class ClientWorker {
  constructor(client, globalQueue, db, tiktok, downloader, telegram) {
    this.client = client;
    this.queue = globalQueue;
    this.db = db;
    this.tiktok = tiktok;
    this.downloader = downloader;
    this.telegram = telegram;
  }

  async run() {
    const accounts = await this.db.getAccounts(this.client.id);
    for (const acc of accounts) {
      const videos = await this.tiktok.getVideos(acc.username, 7);

      for (const id of videos.reverse()) {
        this.queue.add(() => this.processVideo(acc, id));
      }
    }
  }

  async processVideo(account, videoId, attempt = 1) {
    const MAX = 3;

    try {
      const sent = await this.db.isSent(videoId, this.client.id);
      if (sent) return;

      const file = await this.downloader.download(videoId, this.client.id, account.username);

      await this.telegram.send(account.channel_id, file, account.username, videoId, account.username);

      await this.db.markSent(videoId, this.client.id);
      // this.downloader.delete(file); // Comentado según solicitud
    } catch (err) {
      if (attempt < MAX) {
        setTimeout(() => {
          this.processVideo(account, videoId, attempt + 1);
        }, 2000);
      } else {
        console.log(`❌ Cliente ${this.client.id} intento ${attempt}`, err);
      }
    }
  }
}

module.exports = ClientWorker;
