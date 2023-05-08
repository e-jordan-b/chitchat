import cron from 'node-cron';

const job = cron.schedule('*/5 * * * *', getSummaries, { scheduled: false });

async function getSummaries () {
  //test
  console.log('we out here in schedule land')
  //base case - no transcripts in local memory

  //fetch transcripts from local memory

  //create openai prompt

  //req openai

  //update mongoDB with new summaries

  //delete from local memory

}

export default job;