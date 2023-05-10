import { ITranscript } from '../models/transcription-model';
import { getFromMemoryByRoom } from '../services/memory-service';
import { Configuration, OpenAIApi, CreateChatCompletionResponse } from "openai";
import { createSummary } from '../models/summary-model';
import { response } from 'express';
import { Room } from '../models/room-model';
import { ObjectId } from 'mongoose';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let roomId: string | null = null;

class SummaryScheduler {
  intervalId: NodeJS.Timeout | null;
  taskInterval: number;
  roomId: ObjectId;
  roomUUID: string;
  agenda: string[];

  constructor(interval: number, roomId: ObjectId, roomUUID: string, agenda: string[]) {
    this.intervalId = null;
    this.taskInterval = interval;
    this.roomId = roomId;
    this.roomUUID = roomUUID;
    this.agenda = agenda;
  }

  start(args: string) {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.getSummaries(args);
      }, this.taskInterval);
    }
  }

  async getSummaries (roomUUID: string)  {
    //test
    console.log('INSIDE SCHEDULER CB: ', this.roomId)
    //fetch transcripts from local memory
    //base case - no transcripts in local memory
    const transcripts = getFromMemoryByRoom(roomUUID);

    if (transcripts === undefined) return;

    let allFormattedTranscripts: string = '';
    transcripts?.forEach((transcript) => {
      const formattedTranscript = `At ${transcript.timestamp} ${transcript.speaker} said: ${transcript.text} \n\n`;

      allFormattedTranscripts = allFormattedTranscripts.concat(formattedTranscript);
    })
    console.log(allFormattedTranscripts)


    //create openai prompt
    const prompt = `Summarise the following meeting transcripts where the agenda is ${this.agenda}: \n\n ${allFormattedTranscripts}`
    console.log(prompt);
    //req openai
    await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
     {"role": "system", "content": 'You are meeting summary assistant'},
     {"role": "user", "content": prompt},
    ],
      max_tokens: 900,
      temperature: 0.1,
    })
    .then((response) => {
      const summaryText = response.data.choices[0].message?.content;

      const summary = {
        timestamp: new Date().getTime(),
        room: this.roomId,
        text: summaryText!,
      }
      createSummary(summary)
    })


    //update mongoDB with new summaries

    //delete from local memory
  }

  stop () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}


