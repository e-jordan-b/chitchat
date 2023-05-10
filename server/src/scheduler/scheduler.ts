import { ITranscript } from '../models/transcription-model';
import { popFromMemoryByRoom } from '../services/memory-service';
import { Configuration, OpenAIApi } from "openai";
import { createSummary } from '../models/summary-model';
import { ObjectId } from 'mongoose';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class SummaryScheduler {
  intervalId: NodeJS.Timeout | null;
  taskInterval: number;
  roomId: ObjectId | string;
  roomUUID: string;
  agenda: string[];

  constructor(interval: number, roomId: ObjectId | string, roomUUID: string, agenda: string[]) {
    this.intervalId = null;
    this.taskInterval = interval;
    this.roomId = roomId;
    this.roomUUID = roomUUID;
    this.agenda = agenda;
  }

  start() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.getSummaries(this.roomUUID);
      }, this.taskInterval);
    }
  }

  async getSummaries (roomUUID: string)  {
    //test
    console.log('INSIDE SCHEDULER CB: ', this.roomId)
    //fetch and delete transcripts from local memory
    const transcripts = popFromMemoryByRoom(roomUUID);

    //base case - no transcripts in local memory
    if (transcripts === undefined) return;

    let allFormattedTranscripts: string = '';
    transcripts?.forEach((transcript) => {
      const formattedTranscript = `At ${transcript.timestamp} ${transcript.speaker} said: ${transcript.text} \n\n`;

      allFormattedTranscripts = allFormattedTranscripts.concat(formattedTranscript);
    })
    console.log(allFormattedTranscripts)


    //create openai prompt
    const prompt = `The following are transcript from a meeting between 2 speakers where the agenda is ${this.agenda}. Please summarise them : \n\n ${allFormattedTranscripts}`
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

      console.log(summaryText);

      const summary = {
        timestamp: new Date().getTime(),
        room: this.roomId,
        text: summaryText!,
      }

      //update mongoDB with new summaries
      createSummary(summary)
    })

  }

  stop () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default SummaryScheduler;