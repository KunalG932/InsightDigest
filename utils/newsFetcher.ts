import Parser from 'rss-parser';
import { telegramBot } from './telegramBot';

type CustomFeed = { title: string; link: string; description: string };
type CustomItem = { title: string; link: string; content: string; enclosure?: { url: string } };

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    item: ['enclosure'],
  },
});

export class NewsFetcher {
  private readonly rssSources: string[];

  constructor() {
    // Add your RSS feed URLs here
    this.rssSources = [
      'http://rss.cnn.com/rss/cnn_topstories.rss',
      'https://feeds.bbci.co.uk/news/rss.xml',
      // Add more RSS sources as needed
    ];
  }

  private async fetchFromSource(url: string): Promise<CustomItem[]> {
    try {
      const feed = await parser.parseURL(url);
      return feed.items as CustomItem[];
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      return [];
    }
  }

  private async sendToTelegram(item: CustomItem) {
    try {
      // Send directly using the telegramBot instance instead of making an HTTP request
      await telegramBot.sendNewsUpdate({
        title: item.title,
        text: `<b>${item.title}</b>\n\n${item.content?.substring(0, 200)}...`,
        imageUrl: item.enclosure?.url,
        articleUrl: item.link,
      });
      console.log(`Successfully sent news: ${item.title}`);
    } catch (error) {
      console.error(`Error sending news to Telegram:`, error);
    }
  }

  public async checkAndSendNews() {
    console.log('Starting news check...');
    
    for (const source of this.rssSources) {
      const items = await this.fetchFromSource(source);
      
      for (const item of items) {
        await this.sendToTelegram(item);
        // Add a small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('Finished news check');
  }
}
