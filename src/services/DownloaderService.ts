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
    const file = path.join(dir, `${videoId}.mp4`);

    await execFilePromise("yt-dlp", [
      "-o",
      file,
      `https://www.tiktok.com/@${username}/video/${videoId}`
    ]);

    return file;
  }

  delete(file: string): void {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

export default DownloaderService;
