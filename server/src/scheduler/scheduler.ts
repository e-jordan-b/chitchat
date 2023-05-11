import { Configuration, OpenAIApi } from "openai";
import { createSummary } from '../models/summary-model';
import TranscriptionService from '../services/transcription-service';
import { Room } from "../models/room-model";
import { Schema } from "mongoose";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class SummaryScheduler {
  intervalId: NodeJS.Timeout | null;
  taskInterval: number;
  roomId: string;
  roomUUID: string;
  agenda: string[];

  constructor(interval: number, roomId: string, roomUUID: string, agenda: string[]) {
    this.intervalId = null;
    this.taskInterval = interval;
    this.roomId = roomId;
    this.roomUUID = roomUUID;
    this.agenda = agenda;
  }

  start(transcriptionService: TranscriptionService, IDRoom: string | Schema.Types.ObjectId) {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.getSummaries(this.roomUUID, transcriptionService, IDRoom);
      }, this.taskInterval);
    }
  }

  async getSummaries (roomUUID: string, transcriptionService: TranscriptionService, IDRoom: string | Schema.Types.ObjectId)  {
    //test
    console.log('INSIDE SCHEDULER CB: ', this.roomId)
    //fetch and delete transcripts from local memory
    const transcripts = transcriptionService.popTranscripts(this.roomId); ;

    //base case - no transcripts in local memory
    if (!transcripts) return;

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
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
     {"role": "system", "content": 'You are meeting summary assistant'},
     {"role": "user", "content": prompt},
    ],
      max_tokens: 900,
      temperature: 0.1,
    })

    if ( response.data && response.data.choices && response.data.choices.length && response.data.choices[0].message) {

      const summaryText = response.data.choices[0].message?.content;

      console.log(summaryText);

      const summary = {
        timestamp: new Date().getTime(),
        room: IDRoom,
        text: summaryText!,
      }

      //update mongoDB with new summaries
      const { summary: savedSummary, error } = await createSummary(summary);
      if ( error || !savedSummary) {
        console.log('SAVING SUMMARY ERROR: ', error);
      } else {

        Room.findByIdAndUpdate(IDRoom, { $push: { summaries: savedSummary._id}}, { new: true});
      }


    }

  }

  stop () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default SummaryScheduler;