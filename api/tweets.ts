import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const BIN_ID = '6713c6caacd3cb34a899b262'; 
const API_KEY = '$2a$10$tLeRimVEHOxU0NpB.1oNm.AfMTykeajNJofXZAy.wdnbpBgUVRZue'; 

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === 'POST') {
    const newTweet = req.body;

    // Validate the incoming request
    if (!newTweet.content) {
      res.status(400).json({ error: 'Content is required.' });
    } else {
      try {
        // Fetch existing data
        const fetchResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY // Use X-Master-Key for authorization
          }
        });

        if (!fetchResponse.ok) {
          throw new Error('Failed to fetch data from JSONBin');
        }

        const existingData = await fetchResponse.json();
        const tweets = existingData.record.tweets || [];

        // Prepare new tweet object
        const tweetWithUser = {
          user: 'Twitter User',
          userHandle: 'noah_ayyubi',
          content: newTweet.content,
          image: null,
        };

        // Push the new tweet to the array
        tweets.push(tweetWithUser);

        // Use POST to create/update the bin with the new data
        const postResponse = await fetch(`https://api.jsonbin.io/v3/b`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY,
          },
          body: JSON.stringify({ tweets }) // Send the entire tweets array as the new data
        });

        if (!postResponse.ok) {
          throw new Error('Failed to post data to JSONBin');
        }

        res.status(201).json(tweetWithUser); // Respond with the created tweet
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving tweet to JSONBin' }); // Return error message in JSON format
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` }); // Return error in JSON format
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
