import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const BIN_ID = '6713c6caacd3cb34a899b262'; 
const ACCESS_KEY = '$2a$10$tLeRimVEHOxU0NpB.1oNm.AfMTykeajNJofXZAy.wdnbpBgUVRZue'; 
const API_KEY = '$2a$10$Y2cSsRKOyq5nTYjGxdwiRuBy6GNQdwP1UGjzQ44aBtH18ec5Qhp6a';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`Received ${req.method} request to ${req.url}`);

  if (req.method === 'PUT') {
    const newTweet = req.body;
    console.log('Received new tweet:', newTweet); // Log the incoming tweet

    // Validate the incoming request
    if (!newTweet.content) {
      res.status(400).json({ error: 'Content is required.' });
      return;
    }

    try {
      // Fetch the existing tweets from JSONBin
      const getResponse = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        headers: {
          'X-Master-Key': ACCESS_KEY,
        },
      });

      const tweets = getResponse.data.record.tweets || [];

      // Add the new tweet
      const tweetWithUser = {
        user: 'Twitter User',
        userHandle: 'noah_ayyubi',
        content: newTweet.content,
        image: null,
      };

      tweets.push(tweetWithUser);

      // Update the JSONBin with the new list of tweets
      const putResponse = await axios.put(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        { tweets },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': ACCESS_KEY,
            'X-Bin-Versioning': 'false', // Prevents creating new versions unnecessarily
          },
        }
      );

      // Respond with the newly added tweet
      res.status(200).json(tweetWithUser);
    } catch (error) {
      console.error('Error updating JSONBin:', error);
      res.status(500).send('Error updating JSONBin');
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


//------------------------for serverless
// import type { VercelRequest, VercelResponse } from '@vercel/node';
// import fs from 'fs';
// import path from 'path';

// export default function handler(req: VercelRequest, res: VercelResponse) {
//   console.log(`Received ${req.method} request to ${req.url}`);

//   if (req.method === 'POST') {
//     const newTweet = req.body;
//     console.log('Received new tweet:', newTweet); // Log the incoming tweet

//     // Validate the incoming request
//     if (!newTweet.content) {
//       return res.status(400).json({ error: 'Content is required.' });
//     }

//     fs.readFile(path.join(__dirname, '..', 'data', 'tweetdata.json'), 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading tweetdata.json:', err);
//         res.status(500).send('Error loading tweetdata.json');
//         return;
//       }

//       const tweets = JSON.parse(data);
//       const tweetWithUser = {
//         user: 'Twitter User',
//         userHandle: 'noah_ayyubi',
//         content: newTweet.content,
//         image: null,
//       };

//       tweets.tweets.push(tweetWithUser);

//       fs.writeFile(path.join(__dirname, '..', 'data', 'tweetdata.json'), JSON.stringify(tweets, null, 2), (err) => {
//         if (err) {
//           console.error('Error saving tweetdata.json:', err);
//           res.status(500).send('Error saving tweetdata.json');
//           return;
//         }

//         res.status(201).json(tweetWithUser);
//       });
//     });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
