import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const BIN_ID = '6713c6caacd3cb34a899b262'; 
const API_KEY = '$2a$10$tLeRimVEHOxU0NpB.1oNm.AfMTykeajNJofXZAy.wdnbpBgUVRZue'; 

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY // Include API Key for authentication
      }
    });

    if (!response.ok) throw new Error('Failed to fetch data from JSONBin');

    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data.record); // Assuming your tweets are in the 'record' field
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading tweets from JSONBin');
  }
}


//----------------- For serverless 

// import type { VercelRequest, VercelResponse } from '@vercel/node';
// import fs from 'fs';
// import path from 'path';

// export default function handler(req: VercelRequest, res: VercelResponse) {
//   fs.readFile(path.join(__dirname, '..', 'data', 'tweetdata.json'), 'utf8', (err, data) => {
//     if (err) {
//       res.status(500).send('Error loading tweetdata.json');
//     } else {
//       res.setHeader('Content-Type', 'application/json');
//       res.status(200).send(data);
//     }
//   });
// }
