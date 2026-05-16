import { execFile } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

const execFilePromise = util.promisify(execFile);

class DownloaderService {
  getClientDir(clientId: number): string {
    const dir = `./tmp/client_${clientId}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }

  async download(videoId: string, clientId: number, username: string): Promise<string> {
    const dir = this.getClientDir(clientId);
    const safeName = videoId.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
    const file = path.join(dir, `${safeName}.mp4`);
    const url = videoId.startsWith("http") ? videoId : `https://www.tiktok.com/@${username}/video/${videoId}`;

    await execFilePromise("yt-dlp", ["-o", file, url]);

    return file;
  }

  delete(file: string): void {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

export default DownloaderService;
