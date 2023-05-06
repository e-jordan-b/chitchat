import { WebSocket, WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';

import key from './gcloud-key.json';
import { CANCELLED } from 'dns';

dotenv.config({ path: __dirname + '../../' });

const socketServer = new WebSocketServer({ port: 3001 });

socketServer.on('connection', (socketClient) => {
  // RoomID
  console.log('Client connected');
  const client = new SpeechClient({
    credentials: {
      client_email: 'chitchat-server@chitchat-385914.iam.gserviceaccount.com',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCo5JZT7QBmIEfA\noUE3XD29XTkRtBDhfVePDRLQBuJDe9deP8DR+PXG0Y21bfe2auK8YtH+wzmikXLH\newqXx8wjCpZGziJaz8BicE2aE2MaZj5lLp5eRfTd/hLtN4X7zWDBSn6O07lMnBDf\n1wiTh9zGfs9dX7ZXYljnVtUAM3yKucmWnPAtsso3tNZ4DT3hhwbprnnBFzLDrE1J\nZCZx3G0aC1n4eB1DOY/LHk0wB7MdOFDhiFTu8hkix04nsg4TyH3VtHS62Z33q5J9\nQ0OUoKFHojEg58PGN0S3nyQkWXRlWWjCf8scaWkOfs92AX0p9185L34P/AkCIf8H\nkXJCl1HdAgMBAAECggEACfkUu8tbApM1mXU/ZbaSxyIZ/7OFBN1DAXJeSFFq8ZAx\n0ftsXLNZemfr+PXC5fWSAozIfxIytSizwReNzK08HsLK+xuRLl3MXvCBuWKB4uoW\ne7p3S8E2w35AZA73+iJd0o9RdNUH9DM9BD+G3p6Fr2TtxFylmd7EhpIujRuWzZXJ\n9N6341zkT1QZsZ287MrtnKHsMMz/9Rin1XbErxAWVkHU9YuPMeiTCgt97u2JqJV6\nTo52JgfQ3L3EKIfNnc/GRw2JkJG3vIU8yJfOYQQnx616gScvA6X395zEM1aYyDe/\nQKeQQjCRJI/7QJLq9UO3luXhVYi93lezfUqMZzr5IwKBgQDtJuAs71YNhGN4HspM\n3KgCZUuVklWYHyKT6uJT0K5lnwNZjvy0dpn1f5/RrZTajo/Zlmb8LDjFie3A+PJs\nbALTZ31NyRs4RFNPAGkO5eOCfzHQL4bXCapQG3nN1qO0mJi/lM/U+bLOYsclnpA3\ngRDknGTrtJsGw/u+sc9Y1TNCrwKBgQC2UOfgXWHOXkJsZe8cicJyTFw4wzN3iU1x\n3ViUqdI0SDjoCWVK0J77/i4/p4CFNiGyLDg/gSZ1EOSoiwoHb2ldey/Qk4059xlV\nVwpyBE9mx7h94CCHQgToOkW5XYAhy7mtXaIJIy5ovoXRN8tSd8cc6GJ8l5XIyNhG\nvS1U1uXHMwKBgQCs2IbPeWlI1NMCu75KoxC5Hkcmrs8/3oF/OdTXreNOIcV5QuQg\nS8kOy4QaeN9jJEDoH9zTsw91un/VBBz8tQSiPG1xgkAalIH7tJrdxuQ5Oqd9ywYG\nOP8u/7eZNPWALTA3giiwW4XdMtVfL+CA88ryNKLBwJK1LaaQaFxtrIZ99QKBgDhQ\n/Y9cyR2KGFKLmjTiiOHtnH8cLQW7r+SATyB85KWpuYpTfKqDjtigR4D6KMT9V6NF\n7YoQRuTadwdpC4wIai+qIbb4HSPOpFCsNlnJ4w0InIClfubJCeMCPQ9pRm8qEwzu\nY2MXLvrD/2oFJhUvUp4nWmTKHkaLY+NWBG60gv3pAoGAYNHp7W7kQ27RUcLrxJ73\nuMlhlbRZc9SMshtjMlYLobxsOygdZMMnX2AWWhe2CMACgL1MJSgl89K8E7j+AZbg\njy/qOGwTB0GqtVq/mKN5fmOK+e14U3OWXe0n0ibfjYsxckTsstm1VYFrrJgYdxba\nrD/XnAX85wFlIYfNT9LyG+Y=\n-----END PRIVATE KEY-----\n',
    },
  });

  const request = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
    interimResults: false, // If you want interim results, set this to true
  };

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

      // SEND to RoomID + Save it to MONGO?
      socketServer.clients.forEach((client) => {
        if (client.roomID === 'thisroom' && client.readyState === WebSocket.OPEN) {
          client.send('Data')
        }
      })

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
