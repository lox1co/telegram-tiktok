"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const execFilePromise = util_1.default.promisify(child_process_1.execFile);
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
        return stdout.trim().split("\n").filter(Boolean);
    }
}
exports.default = TikTokService;
