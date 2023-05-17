import React, { useEffect, useState } from 'react';
import AuthModal from '../auth/auth-modal';
import title from '../../assets/ChitChat.png'

import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';
import CreateRoom from '../create-room/create-room';
import { BsFillPersonFill } from "react-icons/bs"
import { TbSquarePlus} from "react-icons/tb"
import { useAuth } from '../../hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import {TbArrowBigRight} from 'react-icons/tb'

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




    <div id="landing-wrapper" className="flex h-screen w-screen flex-col justify-center items-center overflow-auto">

    <nav className='w-full h-20 min-h-[80px] flex items-center justify-between dark:bg-gray-800'>
      <div>
       <img src={title} alt='chitchat title' className=' h-8 self-center ml-7 '></img>

      </div>
      <div className='flex '>


        <div className='self-center mr-7 hidden font-medium sm:hidden md:block lg:block xl:block 2xl:block cursor-default	 dark:text-custom-purple-50'>{formattedDate}</div>
        <button
          onClick={() => {setShowAuth(true)}}
          className='h-12 w-12  sm:w-32 ml:w-48 lg:w-48 xl:w-48 2xl:w-48 bg-custom-purple-500 rounded-md text-white text-lg flex justify-center items-center mr-7 shadow-md transition-colors duration-150 hover:bg-custom-purple-600 hover:shadow-xl' ><BsFillPersonFill className='sm:mr-2 md:mr-2 lg:mr-2 xl:mr-2 2xl:mr-2'/>{window.innerWidth >= 640 ? "Login" : null}</button>
      </div>
    </nav>



    <div className=' w-full h-full flex flex-col-reverse sm:flex-col-reverse md:flex-row lg:flex-row xl:flex-row 2xl:flex-row justify-center items-start sm:items-center md:items-center lg:items-center xl:items-center 2xl:items-center dark:bg-gray-800'>




      <div className='w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2  flex flex-col items-center justify-center'>

       <div className='w-4/5 md:w-3/5 lg:w-3/5 xl:w-3/5 2xl:w-3/5'>

          <div>
            <h1 className={` dark:text-custom-purple-50 cursor-default	text-2xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl ${window.innerWidth < 400 ? null : "whitespace-nowrap"} font-semibold`}>Effortless Communication</h1>
            <h2 className=' dark:text-custom-purple-500 cursor-default	text-lg md:text-lg  lg:text-xl xl:text-2xl 2xl:text-3xl mt-5  font-medium text-slate-900'>Connect and Sumarize Your Calls with Ease</h2>
          </div>

          <div className='mt-7 cursor-default 	'>
            <p className='text-lg md:text-base text-slate-700 dark:text-custom-purple-300'>
              Unlock the Power of Productive Conversations with Our Cutting-Edge Platform:
            Seamlessly Initiate Calls, Define Comprehensive Agendas, and Effortlessly Receive Live
            Summaries Every 5 Minutes, Allowing You to Make the Most of Every Conversation!
            </p>
          </div>

          <div className='mt-16 flex items-center'>

            <button
            onClick={() => setShowCreate(true)}
            className='h-12 w-auto sm:w-auto md:w-auto lg:w-48 xl:w-48 2xl:w-48 px-2  bg-custom-purple-500 md:px-2 rounded-md text-white text-lg flex justify-center items-center transition-all duration-150 shadow-md hover:bg-custom-purple-600 hover:shadow-xl'>

              <TbSquarePlus
                size={30}
                className={`hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:block transition-none`}/>
              <TbSquarePlus size={30} className='bg:hidden sm:inline md:inline lg:hidden xl:hidden 2xl:hidden'/><span className={`px-2 whitespace-nowrap select-none hidden sm:inline md:hidden lg:inline xl:inline 2xl:inline`}>Start a meeting</span>
              </button>
              <input
              className='text-lg text-center border border-custom-purple-500 text:custom-purple-500 rounded-md h-12 sm:ml-3 ml-3 w-36 md:w-48 lg:w-48 xl:w-48 2xl:w-48'
              placeholder={window.innerWidth > 768 ? "Enter code to join" : "Enter code"}

              onChange={(e) => setJoinCode(e.target.value)}
              ></input>


              <button
                className={`${!joinCode ? "invisible" : "animate-pulse" } transition-all drop-shadow-md bg-green-400 hover:bg-green-600 hover:animate-none h-12 w-auto rounded-md min-w-20 ml-3 px-2 text-lg text-slate-800`}
                onClick={() => navigate(`/room/?url=${joinCode}`)}
                ><TbArrowBigRight size={30} color='white'/>
              </button>

          </div>
          <div id="sapcer" className="mt-16 hidden sm:hidden md:block lg:block xl:block 2xl:block"></div>
        </div>
      </div>

      <section id="animated-illustration" className='w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 h-1/7 flex justify-center items-center m-0 sm:m-0'>
        <Lottie animationData={animation} loop={true} autoplay className='h-full w-11/12'></Lottie>
      </section>

      {/* Clicking create as a guest should trigger the auth modal. the must be signed in surves no purpose */}
      <CreateRoom isVisible={showCreate} onClose={() => setShowCreate(false)}></CreateRoom>
      <AuthModal isVisible={showAuth} onClose={() => setShowAuth(false)}></AuthModal>
    </div>
  </div>

  );
};


export default Landing;
