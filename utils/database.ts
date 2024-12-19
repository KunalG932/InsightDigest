import Database from 'better-sqlite3';
import path from 'path';

class NewsDatabase {
  private db: Database.Database;

  constructor() {
    this.db = new Database(path.join(process.cwd(), 'news.db'));
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sent_news (
        url TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  public isNewsSent(url: string): boolean {
    const result = this.db.prepare('SELECT url FROM sent_news WHERE url = ?').get(url);
    return !!result;
  }

  public markNewsAsSent(url: string, title: string): void {
    this.db.prepare('INSERT OR IGNORE INTO sent_news (url, title) VALUES (?, ?)').run(url, title);
  }

  public getRecentNews(limit: number = 10): any[] {
    return this.db
      .prepare('SELECT * FROM sent_news ORDER BY sent_at DESC LIMIT ?')
      .all(limit);
  }
}

// Create a singleton instance
export const newsDB = new NewsDatabase();
