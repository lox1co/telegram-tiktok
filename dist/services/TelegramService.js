"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
class TelegramService {
    bot;
    constructor(token) {
        this.bot = new telegraf_1.Telegraf(token);
    }
    async send(channelId, file, username, videoId) {
        await this.bot.telegram.sendVideo(channelId, { source: file }, {
            caption: `🎥 Nuevo video\n🔗 https://www.tiktok.com/@${username}/video/${videoId}`
        });
    }
}
exports.default = TelegramService;
