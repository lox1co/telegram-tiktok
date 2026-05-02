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
    customCaption?: string,
  ): Promise<void> {
    const caption = customCaption || `🎥 Nuevo video\n🔗 https://www.tiktok.com/@${username}/video/${videoId}`;

    await this.bot.telegram.sendVideo(
      channelId,
      { source: file },
      {
        caption,
        message_thread_id: threadId ? Number(threadId) : undefined,
      },
    );
  }
}

export default TelegramService;
