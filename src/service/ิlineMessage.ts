import { Client, ClientConfig , TextMessage } from '@line/bot-sdk';

// ข้อมูลที่ได้จาก Channel ที่คุณสร้าง
const config: ClientConfig  = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

// สร้าง instance ของ LINE Client
const client = new Client(config);

// ฟังก์ชันส่งข้อความ
export const sendMessage = async (userId: string, message: string) => {
  // Explicitly specify the correct type 'text' for type property
  const textMessage: TextMessage = {
    type: 'text',  // Ensure that 'type' is exactly 'text'
    text: message,
  };

  try {
    await client.pushMessage(userId, textMessage);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
