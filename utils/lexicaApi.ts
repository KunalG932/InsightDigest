import axios from 'axios';

export interface LexicaArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
}

export class LexicaAPI {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.LEXICA_API_URL || 'https://api.lexica.com/v1';
    this.apiKey = process.env.LEXICA_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('LEXICA_API_KEY is not set in environment variables');
    }
  }

  async getLatestNews(): Promise<LexicaArticle[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/news/latest`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news from Lexica:', error);
      throw error;
    }
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/summarize`, {
        content,
        maxLength: 200
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }
}

export const lexicaApi = new LexicaAPI();
