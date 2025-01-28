import { NextRequest, NextResponse } from "next/server";
import { Client, middleware, WebhookEvent } from "@line/bot-sdk";

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.CHANNEL_SECRET || "",
};

const client = new Client(config);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events: WebhookEvent[] = body.events;

    const results = await Promise.all(events.map(handleEvents));
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Error handling webhook:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleEvents(event: WebhookEvent) {
  if (event.type !== "message" || (event.message.type !== "text" && event.message.type !== "image")) {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  if (!userId) {
    console.error("UserID is missing");
    return;
  }

  try {
    const profile = await client.getProfile(userId);
    const displayName = profile.displayName;

    if (event.message.type === "text") {
      const userMessage = event.message.text;

      return client.replyMessage(event.replyToken, [
        {
          type: "text",
          text: `คุณส่งเป็นข้อความ '${userMessage}'\nUserID ของคุณคือ: ${userId}\nชื่อผู้ใช้: ${displayName}`,
        },
      ]);
    }

    if (event.message.type === "image") {
      const stream = await client.getMessageContent(event.message.id);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString("base64");
      const base64First30 = base64.substring(0, 30);

      return client.replyMessage(event.replyToken, [
        {
          type: "text",
          text: `คุณส่งเป็นภาพ Base64 ของคุณ: ${base64First30}\nUserID ของคุณคือ: ${userId}\nชื่อผู้ใช้: ${displayName}`,
        },
      ]);
    }
  } catch (err) {
    console.error("Error handling event:", err);
    return client.replyMessage(event.replyToken, [
      {
        type: "text",
        text: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      },
    ]);
  }
}
