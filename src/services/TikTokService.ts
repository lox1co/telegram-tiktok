import { execFile } from "child_process";
import util from "util";

const execFilePromise = util.promisify(execFile);

class TikTokService {
  async getVideos(username: string, limit: number = 7): Promise<string[]> {
    const { stdout } = await execFilePromise("yt-dlp", [
      "--flat-playlist",
      "--print",
      "%(id)s",
      "--playlist-items",
      `1:${limit}`,
      `https://www.tiktok.com/@${username}`
    ]);

    return stdout.trim().split("\n").filter(Boolean);
  }
}

export default TikTokService;
