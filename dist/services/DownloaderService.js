"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execFilePromise = util_1.default.promisify(child_process_1.execFile);
class DownloaderService {
    getClientDir(clientId) {
        const dir = `./tmp/client_${clientId}`;
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
        return dir;
    }
    async download(videoId, clientId, username) {
        const dir = this.getClientDir(clientId);
        const file = path_1.default.join(dir, `${videoId}.mp4`);
        await execFilePromise("yt-dlp", [
            "-o",
            file,
            `https://www.tiktok.com/@${username}/video/${videoId}`
        ]);
        return file;
    }
    delete(file) {
        if (fs_1.default.existsSync(file))
            fs_1.default.unlinkSync(file);
    }
}
exports.default = DownloaderService;
