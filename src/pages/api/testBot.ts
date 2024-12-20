import { NextApiRequest, NextApiResponse } from 'next';
import { telegramBot } from '../../../utils/telegramBot';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // First test the bot connection
    const isConnected = await telegramBot.testConnection();
    if (!isConnected) {
      return res.status(500).json({ message: 'Bot connection test failed' });
    }

    // Try sending a test message
    await telegramBot.sendNewsUpdate({
      text: '<b>Test Message</b>\n\nThis is a test message from your news bot.',
      articleUrl: 'https://example.com'
    });

    res.status(200).json({ 
      message: 'Test successful',
      status: 'sent'
    });
  } catch (error: any) {
    console.error('Test failed:', error);
    res.status(500).json({ 
      message: 'Test failed', 
      error: error.response?.data || error.message 
    });
  }
}
