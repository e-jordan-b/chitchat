import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import animation from "../assets/animation.json";
import Lottie from 'lottie-react';

export default function Start() {
const navigate = useNavigate();
const [joinCode, setJoinCode] = useState<string>('')

  const handleCreateClick = () => {
    navigate('/settings')
  }

  const handleJoinClick = () => {
    if(!joinCode) return console.error('no join code entered')
    navigate(`/settings/${joinCode}`)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinCode(e.target.value);
  };

  // return (
  //   <div className='flex justify-center items-center h-screen'>

  //     <div className='flex flex-col items-start'>

  //     <button
  //         onClick={handleCreateClick}
  //         className='mb-5 rounded-md border border-black px-5 py-2 bg-blue-500 text-white'
  //         >
  //         create
  //         </button>

  //     <div>
  //       <input
  //       onChange={handleCodeChange}
  //         defaultValue={joinCode}
  //         className="h-10 border border-black rounded-md"type="text"
  //         />
  //         <button
  //           onClick={handleJoinClick}
  //           className="mb-5 rounded-md border border-black px-5 py-2 bg-green-500 text-white"
  //           >
  //           join
  //           </button>
  //     </div>
  //         </div>

  //   </div>
  // )







  return (
    <>
    <section id="call-entrypoint"
      className='flex justify-center items-center h-full w-full bg-green-500
                flex-col-reverse md:flex-row
      '>



        <section id="landing-text" className='flex flex-col items-center bg-indigo-800 md:w-3/5 w-full h-full'>
          <div className='w-3/4 h-full flex flex-col justify-start md:justify-center bg-slate-400'>

          <h1 className='md:text-6xl text-3xl text-stone-900 font-semibold bg-green-100'>Effortless Communication</h1>
          <h2 className='text-4xl'>Connect and Sumarize Your Calls with Ease</h2>

          <div className='flex flex-col bg-yellow-300'>
          <p className='text- text-slate-700 leading-8 text-justify bg-red-500'>
            Unlock the Power of Productive Conversations with Our Cutting-Edge Platform: Seamlessly Initiate Calls, Define Comprehensive Agendas, and Effortlessly Receive Live Summaries Every 5 Minutes, Allowing You to Make the Most of Every Conversation!</p>

          </div>
          <div className='flex bg-purple-400'>
            <button
            onClick={handleCreateClick}
            className='h-14 w-52 bg-custom-purple-600 rounded-md text-slate-100 text-xl  hover:bg-custom-purple-900'
            >
              Start a Meeting
            </button>

            {/* <label className='border-2 ml-12 rounded-md h-14 shadow-inner self-center shadow-lg shadow-inner'> */}
              <input
              onClick={handleJoinClick}
              className='text-center  shadow-inner'
              placeholder='Enter code to join'></input>
            {/* </label> */}

          </div>

        </div>


        </section>
        <section id="animation" className='w-full md:w-3/5 md:h-full flex justify-center items-center bg-cyan-500'>
          <Lottie
            className='w-2/4'
            animationData={animation}
            loop={true}
            autoplay></Lottie>
        </section>
      </section>


    </>
  );
};

// font-semibold

