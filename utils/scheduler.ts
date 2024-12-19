import cron from 'node-cron';
import { NewsFetcher } from './newsFetcher';

export class NewsScheduler {
  private newsFetcher: NewsFetcher;
  private cronJob: cron.ScheduledTask | null = null;

  constructor() {
    this.newsFetcher = new NewsFetcher();
  }

  public start() {
    if (this.cronJob) {
      console.log('Scheduler is already running');
      return;
    }

    // Run every 30 minutes
    this.cronJob = cron.schedule('*/30 * * * *', () => {
      this.newsFetcher.checkAndSendNews();
    });

    console.log('News scheduler started - will check for news every 30 minutes');
    
    // Run immediately on start
    this.newsFetcher.checkAndSendNews();
  }

  public stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('News scheduler stopped');
    }
  }
}
