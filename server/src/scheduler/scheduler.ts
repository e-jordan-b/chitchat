import { Configuration, OpenAIApi } from 'openai';
import { ISummary, createSummary, updateRoomWithCallSummary } from '../models/summary-model';
import TranscriptionService from '../services/transcription-service';
import { updateRoomWithSummary } from '../models/room-model';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('OPEN AI KEY', process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class SummaryScheduler {
  intervalId: NodeJS.Timeout | null;
  timeInterval: number;
  roomId: string;
  agenda: string[];

  constructor(
    roomId: string,
    agenda: string[] = [],
    timeInterval: number = 5 * 60 * 1000 // 5m * 60s * 1ms
  ) {
    this.intervalId = null;
    this.timeInterval = timeInterval;
    this.roomId = roomId;
    this.agenda = agenda;
  }

  start(transcriptionService: TranscriptionService) {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        console.log('GETTING SUMMARY');
        this.getSummaries(transcriptionService);
      }, this.timeInterval);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async getSummaries(transcriptionService: TranscriptionService) {
    //test
    console.log('INSIDE SCHEDULER CB: ', this.roomId);
    //fetch and delete transcripts from local memory
    const transcripts = transcriptionService.popTranscripts(this.roomId);

    //base case - no transcripts in local memory
    if (!transcripts) return;

    let allFormattedTranscripts: string = '';
    transcripts?.forEach((transcript) => {
      const formattedTranscript = `At ${transcript.timestamp} ${transcript.speaker} said: ${transcript.text} \n\n`;

      allFormattedTranscripts =
        allFormattedTranscripts.concat(formattedTranscript);
    });
    console.log(allFormattedTranscripts);

    //create openai prompt
    const prompt = `The following are transcript from a meeting between 2 speakers where the agenda is ${this.agenda}. Please summarise them : \n\n ${allFormattedTranscripts}`;
    const tokens = (prompt.split(' ').length / 100) * 75;
    // HOW TO compute for response???
    console.log('TOKENS', tokens);
    console.log(prompt);
    //req openai
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are meeting summary assistant' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 900,
        temperature: 0.1,
      });

      if (
        response.data &&
        response.data.choices &&
        response.data.choices.length &&
        response.data.choices[0].message
      ) {
        const summaryText = response.data.choices[0].message?.content;

        console.log(summaryText);
        console.log(response.data.usage)

        const summary = {
          timestamp: new Date().getTime(),
          text: summaryText!,
        };

        //update mongoDB with new summaries
        const { summary: savedSummary, error: createSummaryError } =
          await createSummary(summary);
        if (createSummaryError || !savedSummary || !savedSummary._id) {
          console.log('SAVING SUMMARY ERROR: ', createSummaryError);
          return;
        }

        console.log('IS SUMMARY ID', typeof savedSummary._id);

        const { success, error: updateRoomError } = await updateRoomWithSummary(
          this.roomId,
          savedSummary._id
        );

        if (!success || updateRoomError) {
          console.log('UPDATING ROOM ERROR', updateRoomError);
          return;
        }

        // ALL GOOD
        console.log('SUMMARY SAVED');
      }
    } catch (error) {
      console.log('OPENAI ERROR', error);
    }

    return;
  }
}

export default SummaryScheduler;

export const createFinalSummary = async (summaries: ISummary[], roomUrl: string) => {
  if (!summaries) return;

  summaries.sort((a, b) => a.timestamp - b.timestamp);

  const sortedSummaries = summaries.map(summary => summary.text).join(" ");

  const prompt = `This is a collection of summaries from a meeting: \n\n${sortedSummaries} \n\n. Please create an overall summary of this meeting`

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are meeting summary assistant' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 900,
      temperature: 0.1,
    })
    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length &&
      response.data.choices[0].message
    ) {
      const summaryText = response.data.choices[0].message?.content;

      console.log(summaryText);
      console.log(response.data.usage)

      //!DO WE WANT TO SAVE IT FIRST AS A SUMMARY DOC AND THEN REF IN ROOM OR JUST WHOLE STRING RIGTH IN ROOM???
      // const summary = {
      //   timestamp: new Date().getTime(),
      //   text: summaryText!,
      // };

      // const { summary: savedSummary, error: createSummaryError } =
      //   await createSummary(summary);
      // if (createSummaryError || !savedSummary || !savedSummary._id) {
      //   console.log('SAVING SUMMARY ERROR: ', createSummaryError);
      //   return;
      // }

      const { success, error: updateRoomError } = await updateRoomWithCallSummary(
        roomUrl,
        summaryText
      );

      if (!success || updateRoomError) {
        console.log('UPDATING ROOM ERROR IN FINAL SUMMARY', updateRoomError);
        return;
      }

      // ALL GOOD
      console.log('FINAL SUMMARY SAVED');
      return summaryText;
    }
  } catch (error) {
    console.log('OPENAI ERROR', error);
  }

}