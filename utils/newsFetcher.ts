import { telegramBot } from './telegramBot';
import { lexicaApi, LexicaArticle } from './lexicaApi';
import { newsDB } from './database';

export class NewsFetcher {
  private formatNewsMessage(article: LexicaArticle, summary: string): string {
    const date = new Date(article.publishedAt).toLocaleString();
    return `
📰 <b>${article.title}</b>

${summary}

📅 ${date}
🔍 Source: ${article.source}
`;
  }

  private async sendToTelegram(article: LexicaArticle, summary: string) {
    try {
      if (newsDB.isNewsSent(article.url)) {
        console.log(`News already sent: ${article.title}`);
        return;
      }

      const message = this.formatNewsMessage(article, summary);
      await telegramBot.sendNewsUpdate({
        text: message,
        photo: article.imageUrl,
        articleUrl: article.url,
      });

      // Mark as sent in database
      newsDB.markNewsAsSent(article.url, article.title);
      
      console.log(`Successfully sent news: ${article.title}`);
      
      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error sending news to Telegram:`, error);
    }
  }

  public async checkAndSendNews() {
    try {
      console.log('Starting news check from Lexica API...');
      
      // Fetch latest news from Lexica
      const articles = await lexicaApi.getLatestNews();
      
      // Process each article
      for (const article of articles) {
        try {
          // Generate AI summary
          const summary = await lexicaApi.generateSummary(article.content);
          
          // Send to Telegram
          await this.sendToTelegram(article, summary);
        } catch (error) {
          console.error(`Error processing article ${article.title}:`, error);
        }
      }
      
      console.log('Finished news check');
    } catch (error) {
      console.error('Error in checkAndSendNews:', error);
    }
  }
}
