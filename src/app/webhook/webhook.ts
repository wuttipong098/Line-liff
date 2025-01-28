// pages/api/webhook.ts (rename to .ts for TypeScript)

import { NextApiRequest, NextApiResponse } from 'next';
import { Client, middleware, WebhookEvent } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN||"", // Ensure these are set in your environment variables
  channelSecret: process.env.CHANNEL_SECRET||"",
};

const client = new Client(config);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // The middleware will verify the request signature
      await middleware(config)(req, res, async () => {
        const events: WebhookEvent[] = req.body.events;
        await Promise.all(events.map(handleEvents));
        res.status(200).end(); // Return 200 OK response
      });
    } catch (err) {
      console.error('Error handling webhook:', err);
      res.status(500).end(); // Return 500 if an error occurs
    }
  } else {
    res.status(404).end(); // Return 404 for non-POST requests
  }
}

async function handleEvents(event: WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const userId = event.source.userId;
  if (!userId) {
    console.error('UserID is missing');
    return; // Exit if no userId is present
  }

  try {
    const profile = await client.getProfile(userId);
    const displayName = profile.displayName;

    // Reply with a text message including the user's name
    return client.replyMessage(event.replyToken, [
      {
        type: 'text',
        text: `Hello ${displayName}, your UserID is: ${userId}`,
      },
    ]);
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
}
