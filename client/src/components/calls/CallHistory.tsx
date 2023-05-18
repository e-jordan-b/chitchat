import { useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate, useLoaderData, useParams } from 'react-router-dom';
import type { MeetingObject } from './Table';
import CallsService from '../../services/calls-service';
import AuthService from '../../services/auth-service';
import { GoSignOut } from 'react-icons/go'
import title from "../../assets/ChitChat.png"
import {AiOutlineHome} from 'react-icons/ai'
import axios from 'axios';

import { Table } from './Table';
import ApiService from '../../services/api-service';
import { UserContext } from '../../user/user-context';



  const meetings = [
    {
        "roomId": "645a205090d5f0e0b2b99689",
        "createdAt": 1683628112403,
        "urlUUID": "93917803-f90e-452f-b872-65092d470fe1",
        "callSummary": "The meeting appears to have been focused on discussing various technical aspects related to a transcription service, including the use of Google API and open AI for summarization, rate limiters, and the implementation of a transcription system that sends audio to a server at a websocket and forwards it to Google for real-time summarization. However, there is no clear agenda or discussion of introduction, product pipeline, or objectives, and the transcript provided is incomplete and disjointed. Some speakers did mention discussing the product pipeline and objectives, but there was no further discussion on these topics. Overall, it is difficult to provide a comprehensive summary of the meeting due to the lack of relevant information.",
        "agenda": [
            "introduction",
            "product pipeline :rocket:",
            "objectives :dart:"
        ]
    },
    {
        "roomId": "645e6b3ae650d05d744bf468",
        "createdAt": 1683909434354,
        "urlUUID": "eb25eeb6-1520-417d-95a1-2a900047251b",
        "callSummary": "",
        "agenda": [
            "first agenda point,second agenda point,and so on"
        ]
    },
    {
        "roomId": "645e6b51c9d1b5b6af8a9944",
        "createdAt": 1683909457469,
        "urlUUID": "14cffe71-8d5d-49ab-af0f-b724b088ae9c",
        "callSummary": "",
        "agenda": [
            "first agenda point,second agenda point,and so on"
        ]
    },
    {
        "roomId": "645e6ba01e65c5e5e409a930",
        "createdAt": 1683909536092,
        "urlUUID": "dec90ec0-0844-4c0b-87cc-4b286c0c94eb",
        "callSummary": "",
        "agenda": [
            "first agenda point,second agenda point,and so on"
        ]
    },
    {
        "roomId": "645e81c9dd359e8b623e18d7",
        "createdAt": 1683915209483,
        "urlUUID": "77385ed2-8c52-4c2d-9c96-dd494c43b97f",
        "callSummary": "",
        "agenda": [
            "asdasd",
            "asdasd"
        ]
    },
    {
        "roomId": "645f4e66ad71621887fcf29f",
        "createdAt": 1683967590971,
        "urlUUID": "cc4f2e2d-5ee1-46f8-959a-da9bbff2773f",
        "callSummary": "",
        "agenda": []
    }
]

const CallHistory: React.FC = () => {
  const { userId } = useParams();
  const callsService = new CallsService();
  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<MeetingObject[] | []>([]);
  const [date, setDate] = useState<Date>(new Date());
  const navigate = useNavigate()
  const authService = new AuthService();
  const {user, update} = useContext(UserContext);


  useEffect(() => {

    const fetchData = async () => {
      console.log(userId);
        try {
            const response = await axios.get(`http://localhost:3001/summary/getusersummaries/`,{
              withCredentials: true,
              data: {
                userId
              },
            });
            console.log(response.data);

            setCalls(response.data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    fetchData();
}, []);




  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  };


  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const formattedDate = date.toLocaleString('en-US', options);

  const handleLogout = async () => {
    try {
      const response = await authService.signout();
      if (!response.error) {
        update(undefined);
        navigate('/');
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
};






  return (
    <section id="call-history" className='h-3/4 w-full flex justify-center items-center  dark:bg-gray-800'>
      <div id="table-wrapper" className='max-w-[2000px] w-full h-3/4 flex justify-center items-center rounded-lg mx-5 px-5 mt-10'>
        <Table data={calls} />
        {/* <Table data={meetings} /> */}
      </div>
    </section>
  );
};


export default CallHistory;





