import { WebSocket, WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';

dotenv.config();

const socketServer = new WebSocketServer({ port: 3001 });

const Rooms = {};

// Rooms[id].messages.push();

socketServer.on('connection', (socketClient) => {
  // RoomID
  console.log('Client connected');
  const client = new SpeechClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });

  const recognizeStream = client
    .streamingRecognize({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      interimResults: false,
    })
    .on('error', console.error)
    .on('data', (data) => {
      data.results[0];
      console.log(new Date().toISOString());
      console.log(
        `Transcription: ${data.results[0].alternatives[0].transcript}`
      );

      // SAVE TO LOCAL MEMORY

      // SEND to RoomID + Save it to MONGO?
      // socketServer.clients.forEach((client) => {
      //   if (client.roomID === 'thisroom' && client.readyState === WebSocket.OPEN) {
      //     client.send('Data')
      //   }
      // })

      // schedulere
    });

  socketClient.on('error', console.error);

  socketClient.on('message', (data) => {
    console.log(data);

    recognizeStream.write(data);

    // Instance of google client

    // Socket connection

    // on('event' => {
    // Update mongo document..
    // socketClient.send('sfajbfaisj)
    // })
  });
});
