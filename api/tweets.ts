// writes only on tmp serverless has no writing only reading

import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// Define paths
const DATA_PATH = path.join(__dirname, '..', 'data', 'tweetdata.json');
const TMP_PATH = '/tmp/tweetdata.tmp'; // Temporary path

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log(`Received ${req.method} request to ${req.url}`);

    if (req.method === 'POST') {
        const newTweet = req.body;
        console.log('Received new tweet:', newTweet); // Log the incoming tweet

        // Validate the incoming request
        if (!newTweet.content) {
            return res.status(400).json({ error: 'Content is required.' });
        }

        try {
            // Read existing tweets from tweetdata.json
            const data = await fs.promises.readFile(DATA_PATH, 'utf8');
            const tweets = JSON.parse(data);

            // Create a tweet object with user info
            const tweetWithUser = {
                user: 'Twitter User',
                userHandle: 'noah_ayyubi',
                content: newTweet.content,
                image: null,
            };

            // Add the new tweet to the existing tweets array
            tweets.tweets.push(tweetWithUser);

            // Save to the temporary file (or you could save back to original JSON)
            await fs.promises.writeFile(TMP_PATH, JSON.stringify(tweets, null, 2));

            // Return the new tweet
            res.status(201).json(tweetWithUser);
        } catch (err) {
            console.error('Error handling tweet:', err);
            res.status(500).send('Error handling tweet');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
