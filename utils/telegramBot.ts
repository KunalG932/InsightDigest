import axios from 'axios';

interface InlineKeyboardButton {
  text: string;
  url: string;
}

interface SendMessageParams {
  text: string;
  photo?: string;
  articleUrl?: string;
}

export class TelegramBot {
  private readonly baseUrl: string;
  private readonly channelId: string;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.channelId = process.env.TELEGRAM_CHANNEL_ID || '';
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  private createInlineKeyboard(url: string): { inline_keyboard: InlineKeyboardButton[][] } {
    return {
      inline_keyboard: [[{ text: 'Read Full Article', url }]],
    };
  }

  async sendNewsUpdate({ text, photo, articleUrl }: SendMessageParams): Promise<void> {
    try {
      if (photo) {
        // Send photo with caption and inline keyboard
        await axios.post(`${this.baseUrl}/sendPhoto`, {
          chat_id: this.channelId,
          photo,
          caption: text,
          parse_mode: 'HTML',
          ...(articleUrl && { reply_markup: JSON.stringify(this.createInlineKeyboard(articleUrl)) }),
        });
      } else {
        // Send text message with inline keyboard
        await axios.post(`${this.baseUrl}/sendMessage`, {
          chat_id: this.channelId,
          text,
          parse_mode: 'HTML',
          ...(articleUrl && { reply_markup: JSON.stringify(this.createInlineKeyboard(articleUrl)) }),
        });
      }
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
      throw error;
    }
  }
}

export const telegramBot = new TelegramBot();
