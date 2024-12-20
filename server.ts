import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { NewsScheduler } from './utils/scheduler';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Initialize and start the scheduler
  const scheduler = new NewsScheduler();
  scheduler.start();
  console.log('News scheduler started automatically on server initialization');

  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000, () => {
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});
