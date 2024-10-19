import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  fs.readFile(path.join(__dirname, '..', 'data', 'tweetdata.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading tweetdata.json');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(data);
    }
  });
}
