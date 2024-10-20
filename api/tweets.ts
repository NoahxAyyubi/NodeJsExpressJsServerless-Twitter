import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const BIN_ID = '6713c6caacd3cb34a899b262'; 
const ACCESS_KEY = '$2a$10$tLeRimVEHOxU0NpB.1oNm.AfMTykeajNJofXZAy.wdnbpBgUVRZue'; 
const API_KEY = '$2a$10$Y2cSsRKOyq5nTYjGxdwiRuBy6GNQdwP1UGjzQ44aBtH18ec5Qhp6a';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log(`Received ${req.method} request to ${req.url}`);

    if (req.method === 'PUT') {
        const newTweet = req.body;
        console.log('Received new tweet:', newTweet);

        // Validate the incoming request
        if (!newTweet.content) {
            return res.status(400).json({ error: 'Content is required.' });
        }

        try {
            // Step 1: Fetch the existing bin data
            const existingResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY,
                    'X-Access-Key': ACCESS_KEY // Include the access key here
                }
            });

            if (!existingResponse.ok) {
                throw new Error('Failed to fetch existing bin data');
            }

            const existingData = await existingResponse.json();

            // Step 2: Add the new tweet to the existing data
            const tweetWithUser = {
                user: 'Twitter User',
                userHandle: 'noah_ayyubi',
                content: newTweet.content,
                image: null,
            };

            existingData.tweets.push(tweetWithUser); // Add new tweet

            // Step 3: Update the bin with the new data
            const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY,
                    'X-Access-Key': ACCESS_KEY // Include the access key here
                },
                body: JSON.stringify(existingData)
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update the bin');
            }

            const updatedTweet = await updateResponse.json();
            res.status(200).json(updatedTweet);
        } catch (error) {
            console.error('Error processing tweet:', error);
            res.status(500).json({ error: 'Internal Server Error' });
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
