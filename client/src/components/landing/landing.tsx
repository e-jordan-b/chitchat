import React, { useEffect, useState } from 'react';
import AuthModal from '../auth/auth-modal';
import title from '../../assets/ChitChat.png'
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';
import CreateRoom from '../create-room/create-room';
import {BsPersonVideo, BsFillPersonFill } from "react-icons/bs"
import {TbSquarePlus} from "react-icons/tb"
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
      <div className='w-20 h-14 rounded-lg flex justify-center items-center z-50 bg-teal-600 sm:bg-slate-600 md:bg-red-600 lg:bg-orange-600 xl:bg-green-600 2xl:bg-purple-600'><span>{"w"+window.innerWidth+"px"}</span></div>
        <div className='self-center mr-7'>{formattedDate}</div>
        <button
          onClick={() => {setShowAuth(true)}}
          className='h-12 w-48 bg-custom-purple-500 rounded-md text-white text-lg flex justify-center items-center mr-7 shadow-md transition-all duration-150 hover:bg-custom-purple-600 hover:shadow-xl' ><BsFillPersonFill className='mr-2'/>Login</button>
      </div>
    </nav>
    <div className='flex flex-col-reverse md:flex-row lg:flex-row xl:flex-row 2xl:flex-row align-center h-screen '>




      <div className='w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex flex-col items-center justify-center h-4/5 bg-blue-300'>
        <div className='w-3/5'>
          <div>
            <h1 className='text-4xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-1 whitespace-nowrap'>Effortless Communication</h1>
            <h2 className='text-2xl md:text-lg  lg:text-xl xl:text-2xl 2xl:text-3xl mb-7 whitespace-nowrap text-slate-900'>Connect and Sumarize Your Calls with Ease</h2>
          </div>
          <div>
            <p className='text-lg md:text-base text-slate-700'>Unlock the Power of Productive Conversations with Our Cutting-Edge Platform:
            Seamlessly Initiate Calls, Define Comprehensive Agendas, and Effortlessly Receive Live
            Summaries Every 5 Minutes, Allowing You to Make the Most of Every Conversation!
            </p>
          </div>
          <div className='mt-16 flex items-center'>
            <button
            onClick={() => setShowCreate(true)}
            className='h-12 w-48 bg-custom-purple-500 rounded-md text-white text-lg flex justify-center items-center  transition-all duration-150 shadow-md hover:bg-custom-purple-600 hover:shadow-xl'>
              <BsPersonVideo className={`hidden sm:hidden md:hidden lg:hidden xl:block 2xl:block transition-none`}/><span className={`${window.innerWidth > 640 ? " px-2" : null}`}>{window.innerWidth < 760 ? <TbSquarePlus size={30}/> : "Start a meeting"}</span></button>
              <input
              className='text-lg text-center border border-gray-400 rounded-md h-12 ml-7 w-32 md:w-48 lg:w-48 xl:w-48 2xl:w-48'
              placeholder={window.innerWidth > 768 ? "Enter code to join" : "Enter code"}

              onChange={(e) => setJoinCode(e.target.value)}
              ></input>
               <button className={`${!joinCode ? "hidden" : null } transition-all bg-custom-purple-300 h-12 rounded-md ml-4 w-20 text-lg text-slate-800`}
              onClick={() => navigate(`/room/?url=${joinCode}`)}>Join</button>
          </div>
        </div>
      </div>

      <section id="animated-illustration" className='w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 h-4/5 flex justify-center items-center bg-red-300'>
        <Lottie animationData={animation} loop={true} autoplay className='h-full w-11/12'></Lottie>
      </section>
      <CreateRoom isVisible={showCreate} onClose={() => setShowCreate(false)}></CreateRoom>
      <AuthModal isVisible={showAuth} onClose={() => setShowAuth(false)}></AuthModal>
    </div>
    </>
  );
};


export default Landing;
