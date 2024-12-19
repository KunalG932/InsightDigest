import { NextApiRequest, NextApiResponse } from 'next';
import { NewsScheduler } from '../../../utils/scheduler';

// Create a singleton instance
const scheduler = new NewsScheduler();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    switch (action) {
      case 'start':
        scheduler.start();
        res.status(200).json({ message: 'Scheduler started successfully' });
        break;
      
      case 'stop':
        scheduler.stop();
        res.status(200).json({ message: 'Scheduler stopped successfully' });
        break;
      
      default:
        res.status(400).json({ message: 'Invalid action. Use "start" or "stop".' });
    }
  } catch (error) {
    console.error('Error controlling scheduler:', error);
    res.status(500).json({ message: 'Error controlling scheduler', error });
  }
}
