import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  fs.readFile(path.join(__dirname, '..', 'public', 'index.html'), (err, data) => {
    if (err) {
      res.status(500).send('Error loading index.html');
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).end(data);
    }
  });
}
