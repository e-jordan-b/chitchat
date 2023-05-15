import React, { useEffect, useState } from 'react';
import AuthModal from '../auth/auth-modal';
import logo from '../../assets/[removal 2.png'
import title from '../../assets/ChitChat.png'
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState<boolean>(false);

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
    <nav className='flex flex-row h-24 w-full text-lg font-semibold text-gray-800 '>
      <div className='flex flex-row h-24 w-full'>
        {/* <img src={logo} alt='Logo' className=''></img> */}
        <img src={title} alt='chitchat title' className='ml-10 h-8 self-center '></img>
      </div>
      <div className="flex justify-around w-1/4">
        <p className='self-center text-'>{formattedDate}</p>
        <button
          className='float-right self-center h-14 w-40 shadow-xl bg-custom-purple-500 rounded-md text-xl text-slate-100 hover:bg-custom-purple-800'
          onClick={() => setShowAuth(true)}
        >Login</button>
      </div>
      <AuthModal isVisible={showAuth} onClose={() => setShowAuth(false)} />
    </nav>

    <div className='flex flex-row justify-around w-full font-semibold bg-slate-50'>
      <section className='flex flex-col w-2/6 mt-72 ml-14'>
        <div className='flex flex-col justify-around h-44'>
          <h1 className='text-6xl text-stone-900 font-semibold '>Effortless Communication</h1>
          <h1 className='text-4xl -mt-10'>Connect and Sumarize Your Calls with Ease</h1>
        </div>

        <div className='flex flex-col justify-between mt-14 h-60'>
          <p className='text-2xl text-slate-700 leading-8 text-justify'>Unlock the Power of Productive Conversations with Our Cutting-Edge Platform: Seamlessly Initiate Calls, Define Comprehensive Agendas, and Effortlessly Receive Live Summaries Every 5 Minutes, Allowing You to Make the Most of Every Conversation!</p>

          <div className='flex'>
            <button
            className='h-14 w-52 bg-custom-purple-600 rounded-md text-slate-100 text-xl shadow-lg shadow-inner hover:bg-custom-purple-900'
            >
              Start a Meeting
            </button>

            <label className='border-2 ml-12 rounded-md h-14 shadow-inner self-center shadow-lg shadow-inner'>
              <input
              className='text-lg text-center text-xl leading-[50px] shadow-inner'
              placeholder='Enter code to join'></input>
            </label>

        </div>
        </div>
      </section>
      <section className='mt-32 mr-20'>
          <Lottie animationData={animation} loop={true} autoplay className='w-[800px] h-[800px]'></Lottie>
      </section>
    </div>
    </>
  );
};

export default Landing;
