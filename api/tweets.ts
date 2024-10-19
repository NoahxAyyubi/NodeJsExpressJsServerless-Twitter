import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const newTweet = req.body;

    fs.readFile(path.join(__dirname, '..', 'data', 'tweetdata.json'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error loading tweetdata.json');
        return;
      }

      const tweets = JSON.parse(data);
      const tweetWithUser = {
        user: 'Twitter User',
        userHandle: 'noah_ayyubi',
        content: newTweet.content,
        image: null,
      };

      tweets.tweets.push(tweetWithUser);

      fs.writeFile(path.join(__dirname, '..', 'data', 'tweetdata.json'), JSON.stringify(tweets, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error saving tweetdata.json');
          return;
        }

        res.status(201).json(tweetWithUser);
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
