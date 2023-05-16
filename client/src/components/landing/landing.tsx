import React, { useEffect, useState } from 'react';
import AuthModal from '../auth/auth-modal';
import title from '../../assets/ChitChat.png'
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';
import CreateRoom from '../create-room/create-room';
import {BsPersonVideo, BsFillPersonFill} from "react-icons/bs";
import { useAuth } from '../../hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const navigate = useNavigate()

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  };
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const formattedDate = date.toLocaleString('en-US', options);

  return (
    <>
    <nav className='w-screen h-20 flex items-center justify-between'>
      <div>
        <img src={title} alt='chitchat title' className='ml-10 h-8 self-center '></img>
      </div>
      <div className='flex '>
        <div className='self-center mr-7'>{formattedDate}</div>
        <button
          onClick={() => {setShowAuth(true)}}
          className='h-12 w-48 bg-custom-purple-500 rounded-md text-white text-lg flex justify-center items-center mr-7 shadow-md transition-all duration-150 hover:bg-custom-purple-600 hover:shadow-xl' ><BsFillPersonFill className='mr-2'/>Login</button>
      </div>
    </nav>
    <div className='flex align-center h-screen'>
      <div className='w-1/2 flex flex-col items-center justify-center h-4/5'>
        <div className='w-3/5'>
          <div>
            <h1 className='text-5xl mb-1'>Effortless Communication</h1>
            <h2 className='text-3xl mb-7 text-slate-900'>Connect and Sumarize Your Calls with Ease</h2>
          </div>
          <div>
            <p className='text-lg text-slate-700'>Unlock the Power of Productive Conversations with Our Cutting-Edge Platform:
            Seamlessly Initiate Calls, Define Comprehensive Agendas, and Effortlessly Receive Live
            Summaries Every 5 Minutes, Allowing You to Make the Most of Every Conversation!
            </p>
          </div>
          <div className='mt-16 flex items-center'>
            <button
            onClick={() => setShowCreate(true)}
            className='h-12 w-48 bg-custom-purple-500 rounded-md text-white text-lg flex justify-center items-center mr-7 transition-all duration-150 shadow-md hover:bg-custom-purple-600 hover:shadow-xl'>
              <BsPersonVideo className='mr-2'/>Start a meeting</button>
              <input
              className='text-lg text-center border border-gray-400 rounded-md h-12 w-48'
              placeholder='Enter code to join'

              onChange={(e) => setJoinCode(e.target.value)}
              ></input>
              {joinCode ? <button className='bg-custom-purple-300 h-12 rounded-md ml-4 w-20 text-lg text-slate-800'
              onClick={() => navigate(`/room/?url=${joinCode}`)}>Join</button> : null}
          </div>
        </div>
      </div>
      <div className='w-1/2 h-4/5 flex justify-center items-center'>
        <Lottie animationData={animation} loop={true} autoplay className='h-full'></Lottie>
      </div>
      <CreateRoom isVisible={showCreate} onClose={() => setShowCreate(false)}></CreateRoom>
      <AuthModal isVisible={showAuth} onClose={() => setShowAuth(false)}></AuthModal>
    </div>
    </>
  );
};


export default Landing;
