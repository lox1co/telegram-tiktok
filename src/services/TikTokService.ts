import { YtDlp } from "ytdlp-nodejs";

class TikTokService {
  private ytdlp: YtDlp;

  constructor() {
    this.ytdlp = new YtDlp();
  }

  async getVideos(username: string, limit: number = 7): Promise<string[]> {
    const result = await this.ytdlp
      .execBuilder(`https://www.tiktok.com/@${username}`)
      .addArgs(
        "--flat-playlist",
        "--print",
        "%(id)s",
        "--playlist-items",
        `1:${limit}`
      )
      .exec();

    return result.stdout.trim().split("\n").filter(Boolean);
  }
}

export default TikTokService;
