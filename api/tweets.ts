import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const API_KEY = '$2a$10$Y2cSsRKOyq5nTYjGxdwiRuBy6GNQdwP1UGjzQ44aBtH18ec5Qhp6a'; 
const ACCESS_KEY = '6713c6caacd3cb34a899b26'; // Replace with your actual access key
const BIN_NAME = 'Tweets'; // Set a unique name for your bin

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const newTweet = req.body;

    // Validate the incoming request
    if (!newTweet.content) {
      res.status(400).json({ error: 'Content is required.' });
      // Stop further execution
    }

    // Prepare the tweet object
    const tweetWithUser = {
      user: 'Twitter User',
      userHandle: 'noah_ayyubi',
      content: newTweet.content,
      image: null,
    };

    try {
      // Create a new bin with the tweet
      const createResponse = await fetch(`https://api.jsonbin.io/v3/b`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
          'X-Access-Key': ACCESS_KEY,
          'X-Bin-Name': BIN_NAME,
        },
        body: JSON.stringify({ tweets: [tweetWithUser] }), // Start with the new tweet
      });

      if (!createResponse.ok) throw new Error('Failed to create a new Bin');

      const createdData = await createResponse.json();
      res.status(201).json(createdData); // Return the created bin data
    } catch (err) {
      console.error(err);
      res.status(500).send('Error saving tweet to JSONBin');
    }
  } else {
    res.setHeader('Allow', ['POST']);
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
