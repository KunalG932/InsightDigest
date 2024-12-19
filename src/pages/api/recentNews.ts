import { NextApiRequest, NextApiResponse } from 'next';
import { newsDB } from '../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const recentNews = newsDB.getRecentNews(limit);
    
    res.status(200).json({ 
      news: recentNews,
      count: recentNews.length
    });
  } catch (error) {
    console.error('Error fetching recent news:', error);
    res.status(500).json({ message: 'Error fetching recent news', error });
  }
}
