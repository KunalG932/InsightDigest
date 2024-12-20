import axios from 'axios';
import { telegramBot } from './telegramBot';

interface LexicaNewsItem {
  title: string;
  link: string;
  description: string;
  image: string;
  source: string;
  date: string;
}

export class NewsFetcher {
  private readonly apiUrl = 'https://lexica.qewertyy.dev/news';

  private async fetchNewsFromLexica(): Promise<LexicaNewsItem[]> {
    try {
      console.log('Fetching news from Lexica API...');
      const response = await axios.get(this.apiUrl);
      return response.data.articles || [];
    } catch (error) {
      console.error('Error fetching from Lexica API:', error);
      return [];
    }
  }

  private formatNewsMessage(item: LexicaNewsItem): string {
    const date = new Date(item.date).toLocaleString();
    return `
📰 <b>${item.title}</b>

${item.description}

📍 Source: ${item.source}
📅 ${date}
`;
  }

  private async sendToTelegram(item: LexicaNewsItem) {
    try {
      const message = this.formatNewsMessage(item);
      await telegramBot.sendNewsUpdate({
        text: message,
        photo: item.image,
        articleUrl: item.link,
      });
      console.log(`Successfully sent news: ${item.title}`);
      
      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error sending news to Telegram:', error);
    }
  }

  public async checkAndSendNews() {
    console.log('Starting news check...');
    
    try {
      const newsItems = await this.fetchNewsFromLexica();
      console.log(`Fetched ${newsItems.length} news items`);
      
      for (const item of newsItems) {
        await this.sendToTelegram(item);
      }
    } catch (error) {
      console.error('Error in news check:', error);
    }
    
    console.log('Finished news check');
  }
}
