import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
    }
    this.channelId = process.env.TELEGRAM_CHANNEL_ID || '';
    if (!this.channelId) {
      throw new Error('TELEGRAM_CHANNEL_ID is not set in environment variables');
    }
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  private createInlineKeyboard(url: string): { inline_keyboard: InlineKeyboardButton[][] } {
    return {
      inline_keyboard: [[{ text: 'Read Full Article', url }]],
    };
  }

  async sendNewsUpdate({ text, photo, articleUrl }: SendMessageParams): Promise<void> {
    try {
      console.log('Sending news to Telegram channel:', this.channelId);
      console.log('Message:', text);

      if (photo) {
        // Send photo with caption and inline keyboard
        const response = await axios.post(`${this.baseUrl}/sendPhoto`, {
          chat_id: this.channelId,
          photo,
          caption: text,
          parse_mode: 'HTML',
          ...(articleUrl && { reply_markup: JSON.stringify(this.createInlineKeyboard(articleUrl)) }),
        });
        console.log('Telegram API response:', response.data);
      } else {
        // Send text message with inline keyboard
        const response = await axios.post(`${this.baseUrl}/sendMessage`, {
          chat_id: this.channelId,
          text,
          parse_mode: 'HTML',
          ...(articleUrl && { reply_markup: JSON.stringify(this.createInlineKeyboard(articleUrl)) }),
        });
        console.log('Telegram API response:', response.data);
      }
    } catch (error: any) {
      console.error('Error sending message to Telegram:', error.response?.data || error.message);
      throw error;
    }
  }

  // Test the bot's connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/getMe`);
      console.log('Bot connection test successful:', response.data);
      return true;
    } catch (error: any) {
      console.error('Bot connection test failed:', error.response?.data || error.message);
      return false;
    }
  }
}

export const telegramBot = new TelegramBot();
