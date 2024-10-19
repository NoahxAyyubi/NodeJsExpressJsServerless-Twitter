import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

// Middleware setup
const corsMiddleware = cors();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsMiddleware(req, res, async () => {
    switch (req.method) {
      case 'GET':
        if (req.url === '/') {
          // Serve the index.html file
          fs.readFile(path.join(__dirname, '..', 'public', 'index.html'), (err, data) => {
            if (err) {
              res.status(500).send('Error loading index.html');
            } else {
              res.setHeader('Content-Type', 'text/html');
              res.status(200).end(data);
            }
          });
        } else if (req.url === '/data') {
          // Serve JSON data
          fs.readFile(path.join(__dirname, '..', 'data', 'tweetdata.json'), 'utf8', (err, data) => {
            if (err) {
              res.status(500).send('Error loading tweetdata.json');
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).send(data);
            }
          });
        }
        break;

      case 'POST':
        if (req.url === '/tweets') {
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
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  });
}
