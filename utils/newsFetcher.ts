import axios from 'axios';

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

  public async getNews(): Promise<LexicaNewsItem[]> {
    console.log('Starting news fetch...');
    try {
      const newsItems = await this.fetchNewsFromLexica();
      console.log(`Fetched ${newsItems.length} news items`);
      return newsItems;
    } catch (error) {
      console.error('Error in news fetch:', error);
      return [];
    }
  }
}
