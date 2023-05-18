import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import RoomService from '../../services/room-service';
import {BiArrowBack} from 'react-icons/bi'
import { useAuth } from '../../hooks/use-auth';
import {AiOutlinePaperClip} from "react-icons/ai";
import {BsClipboardPlus, BsClipboardCheck} from "react-icons/bs";

interface Message {
  role: string;
  content: string;
}

interface ISummaryData {
  model: string;
  messages: Message[];
  max_tokens: number;
  temperature: number;
}

const mockData = JSON.parse(`{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are meeting summary assistant"},{"role":"user","content":"This is a collection of summaries from a meeting: \\n\\nThe meeting started with <strong>Federico</strong> and <strong>Leonor</strong> mentioning the free plan for openAI. Later, he mentioned a message indicating hitting the assigned rate limit for the API and suggested following certain steps to resolve it. The agenda for the meeting included discussing the product pipeline and objectives. However, there was no further discussion on these topics. The speakers discussed <strong>rate limiters</strong> and their importance in <strong>API</strong> access. They explained that rate limits are put in place to <u>protect against abuse</u> and misuse of the API, and to ensure fair access for all users. They also discussed how excessive requests from one user or organization can cause issues for everyone else. The agenda for the meeting included introduction, product pipeline, and objectives, but these topics were not discussed in the transcript provided. The meeting started with <strong>Federico</strong> sharing his thoughts and confirming that the connection is working. They discussed the product pipeline and objectives, with <strong>Federico</strong> expressing confidence in the team's ability to do a good job. They also mentioned a call and the need for the system to refresh without any issues. Federico ended the meeting by encouraging the team to continue their work and testing the system's response to stopping. The meeting started with Federico mentioning that they will be receiving transcriptions which will be summarized every minute. They plan to modify the interval to <strong>summarize</strong> every five minutes in production. The summary will be sent back to the client for real-time editing and a general summary of the call will be provided at the end. The transcriptions are implemented through sending the audio stream directly to the server to a web socket and then forwarded to Google. The agenda for the meeting includes introduction, product pipeline, and objectives. The meeting started with a recommendation that they will receive transcriptions which will be summarized every minute. They plan to modify the internal process to summarize their minutes. They implemented a transcription system that sends audio to a server at a websocket and forwards it to Google for real-time summarization. The speakers also mentioned internal information about tokens, but it was not important for the meeting. The speakers discussed their use of Google API and open AI for summarization in their transcription service. They explained that the transcripts are saved locally and formatted for open AI, which provides a summary that is saved to a database. They also mentioned their use of a scheduler to initiate the process when clients connect to their service. The focus of the meeting was on their product pipeline and objectives. Unfortunately, the transcript provided does not contain any relevant information related to the agenda items of the meeting. It appears to be a series of unrelated statements made by one speaker. Therefore, a summary cannot be provided. Unfortunately, there is not enough information provided to summarize the meeting. The speakers seem to be discussing testing something and there are some repeated phrases, but there is no clear agenda or discussion of introduction, product pipeline, or objectives. The meeting started with some technical difficulties, but then Federico discussed the product pipeline and objectives. He mentioned that the product is related to media streaming and media sockets. However, there was some confusion about the number of people involved in the project. Overall, the meeting seemed to focus on discussing the product and its potential future. Unfortunately, based on the transcript provided, it is unclear what the meeting was about as the conversation seems to be unrelated and disjointed. There is no clear agenda or discussion of introduction, product pipeline, or objectives. I'm sorry, but the transcript you provided is incomplete and does not contain any information related to the agenda items of introduction, product pipeline, and objectives. Please provide the complete transcript so I can assist you in summarizing the meeting. The meeting started with Lor and Fed discussing a blocked item that just came in. They talked about how to lock and block it. The conversation then shifted to editing an item by clicking on the pencil icon. They discussed how to edit it and what changes to make. Lor suggested doing something specific, but Fed had a different idea. They eventually agreed to have the item in any case. Towards the end of the meeting, Fed mentioned changing an email and doing a video. Lor agreed and suggested doing bold text. \\n\\n. Please create an overall summary of this meeting"}],"max_tokens":900,"temperature":0.1}`)
// console.log(mockData);
const sanatizeSummary = (summaryData: ISummaryData) => {
  let content = summaryData.messages[1].content;
  let start = content.indexOf("\\n\\n");
  let end = content.lastIndexOf("\\n\\n");

  if (start !== -1 && end !== -1) {
    content = content.slice(start + 4, end);
  }

  content = content.replace(/[\s\n]*\. Please create an overall summary of this meeting$/, '');
  const conversation = content.replace(/<\/?strong>/g, '');
  const speakers = content.match(/<strong>(.*?)<\/strong>/g)?.map(val => val.replace(/<\/?strong>/g,'')).slice(0, 2) as string[];

  return { speakers, conversation };
}


export default function CallDetailView() {
  const [summary, setSummary] = useState<string>("")
  const [speakers, setSpeakers] = useState<string[]>(['Leonor', 'Ali'])
  const [conversation, setConversation] = useState<string>("")
  const [isClicked, setIsClicked] = useState(true)
  const roomService = new RoomService();
  const {roomId} = useParams()
  const navigate = useNavigate();
  const {user} = useAuth();

console.log(mockData);

  useEffect(() => {

    const fetchData = async () => {
      console.log(roomId);
        try {
            const { summary } = await roomService.fecthFinalSummary(roomId!);
            console.log('LEONS MESS RES: ', summary);
            setConversation(String(summary!))

        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    fetchData();


}, []);

const handleBackButton  = () => {
  navigate(`/calls/${user?._id}`)
}


  return (
    <section>


<div className=" w-full h-3/5 mt-16">

  <div className="relative roudend-t-xl  text-white w-full h-[70px] rounded-t-xl drop-shadow-lg dark:border-gray-100 flex justify-center items-center bg-custom-purple-500">
  {/* bg-gradient-to-r from-gradient-pink to-gradient-blue */}


  <button onClick={handleBackButton} type="button"
  className='absolute left-5 rounded-full p-1'><BiArrowBack size={35}/></button><div className='font-bold text-2xl select-none'>A Conversation between {speakers[0]} and {speakers[1]}</div>
  <button className="absolute right-5" onClick={() => {navigator.clipboard.writeText(conversation); setIsClicked(false)}}>{isClicked ? <BsClipboardPlus className='w-14 h-7'/> : <BsClipboardCheck className='w-14 h-7'/>} </button>
  </div>

<div className='h-full overflow-y-auto tablescrollbar'>

  <div className="p-5 w-full h-full max-w-screen-lg text-lg leading-10 break-words tablescrollbar bg-gray-100">
    <div>{conversation}</div>
</div>

  </div>
  <div>
  <div className='h-5 dark:bg-gray-900 bg-gradient-to-r from-gradient-pink to-gradient-blue rounded-b-lg'>


  </div>
</div>
</div>


    </section>


  )
}
