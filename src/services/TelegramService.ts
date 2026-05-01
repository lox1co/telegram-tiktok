import { Telegraf } from "telegraf";

class TelegramService {
  private bot: Telegraf;

  constructor(token: string) {
    this.bot = new Telegraf(token);
  }

  async send(
    channelId: string,
    file: string,
    username: string,
    videoId: string,
    threadId?: string | number,
  ): Promise<void> {
    await this.bot.telegram.sendVideo(
      channelId,
      { source: file },
      {
        caption: `🎥 Nuevo video\n🔗 https://www.tiktok.com/@${username}/video/${videoId}`,
        message_thread_id: threadId ? Number(threadId) : undefined,
      },
    );
  }
}

export default TelegramService;
