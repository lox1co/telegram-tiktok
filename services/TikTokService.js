
const { execFile } = require("child_process");
const util = require("util");
const execFilePromise = util.promisify(execFile);

class TikTokService {
  async getVideos(username, limit = 7) {
    const { stdout } = await execFilePromise("yt-dlp", [
      "--flat-playlist",
      "--print",
      "%(id)s",
      "--playlist-items",
      `1:${limit}`,
      `https://www.tiktok.com/@${username}`
    ]);

    return stdout.trim().split("\n");
  }
}

module.exports = TikTokService;
