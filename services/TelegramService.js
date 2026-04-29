
const { Telegraf } = require('telegraf');

class TelegramService {
    constructor(token) {
        this.bot = new Telegraf(token);
    }

    async send(channelId, file, username, videoId) {
        await this.bot.telegram.sendVideo(
            channelId,
            { source: file },
            {
                caption: `🎥 Nuevo video\n🔗 https://www.tiktok.com/@${username}/video/${videoId}`
            }
        );
    }
}

module.exports = TelegramService;