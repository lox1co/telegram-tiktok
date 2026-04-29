
const { execFile } = require("child_process");
const util = require("util");
const fs = require("fs");
const path = require("path");

const execFilePromise = util.promisify(execFile);

class DownloaderService {
  getClientDir(clientId) {
    const dir = `./tmp/client_${clientId}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }

  async download(videoId, clientId, username) {
    const dir = this.getClientDir(clientId);
    const file = path.join(dir, `${videoId}.mp4`);

    await execFilePromise("yt-dlp", [
      "-o",
      file,
      `https://www.tiktok.com/@${username}/video/${videoId}`
    ]);

    return file;
  }

  delete(file) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

module.exports = DownloaderService;
