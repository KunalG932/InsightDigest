import { NextApiRequest, NextApiResponse } from 'next';
import { telegramBot } from '../../../utils/telegramBot';
import { newsDB } from '../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, summary, imageUrl, articleUrl } = req.body;

    // Check if this news has already been sent
    if (!articleUrl) {
      return res.status(400).json({ message: 'Article URL is required' });
    }

    if (newsDB.isNewsSent(articleUrl)) {
      return res.status(409).json({ 
        message: 'This news has already been sent',
        status: 'duplicate'
      });
    }

    const message = `
<b>${title}</b>

${summary}
`;

    await telegramBot.sendNewsUpdate({
      text: message,
      photo: imageUrl,
      articleUrl,
    });

    // Mark the news as sent
    newsDB.markNewsAsSent(articleUrl, title);

    res.status(200).json({ 
      message: 'News sent successfully',
      status: 'sent'
    });
  } catch (error) {
    console.error('Error sending news:', error);
    res.status(500).json({ message: 'Error sending news', error });
  }
}
