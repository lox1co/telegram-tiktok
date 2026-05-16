import fs from "fs";
import path from "path";
import { YtDlp } from "ytdlp-nodejs";

class DownloaderService {
  private ytdlp: YtDlp;

  constructor() {
    this.ytdlp = new YtDlp();
  }

  getClientDir(clientId: number): string {
    const dir = `./tmp/client_${clientId}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }

  async download(videoId: string, clientId: number, username: string): Promise<string> {
    const dir = this.getClientDir(clientId);
    const file = path.join(dir, `${videoId.substring(0, 20)}.mp4`);
    const url = videoId.startsWith("http") ? videoId : `https://www.tiktok.com/@${username}/video/${videoId}`;

    await this.ytdlp
      .download(url)
      .addArgs("-o", file)
      .run();

    return file;
  }

  delete(file: string): void {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

export default DownloaderService;
