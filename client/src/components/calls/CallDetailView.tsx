import React, { useEffect, useState, useContext } from 'react';
import title from '../../assets/ChitChat.png'
import { useNavigate } from 'react-router-dom';
import { GoSignOut } from 'react-icons/go'
import {AiOutlineHome} from 'react-icons/ai'
import { UserContext } from '../../user/user-context';
import AuthService from '../../services/auth-service';

const CallDetailView: React.FC = () => {
  const {user, update} = useContext(UserContext);



  const navigate = useNavigate()
  const authService = new AuthService();

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
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
};


  return (




    <div id="landing-wrapper" className="flex h-screen w-screen flex-col justify-center items-center overflow-auto">

    <nav className='w-full h-20 min-h-[80px] flex items-center justify-between dark:bg-gray-800'>
      <div>
       <img src={title} alt='chitchat title' className=' h-8 self-center ml-7 '></img>

      </div>
      <div className='flex'>


        <div className='self-center mr-7 hidden font-medium sm:hidden md:block lg:block xl:block 2xl:block cursor-default	 dark:text-custom-purple-50'>{formattedDate}</div>


          <div className='flex justify-center items-center'>
          <button
          onClick={() => navigate('/')}
            className='
              flex justify-center items-center
              h-12 w-12
              sm:w-32 ml:w-32 lg:w-32 xl:w-32 2xl:w-32
            bg-custom-purple-500 hover:bg-custom-purple-600
              rounded-md shadow-md hover:shadow-xl transition-colors duration-150 text-lg text-white'
            >
              <AiOutlineHome className='sm:mr-2 md:mr-2 lg:mr-2 xl:mr-2 2xl:mr-2'/>
              <span className='hidden sm:hidden md:block'>Home</span>
          </button>

          <button
            onClick={handleLogout}
            className='
              flex justify-center items-center
              h-12 w-12 ml-4 mr-7

            bg-custom-purple-900 hover:bg-custom-purple-600
              rounded-md shadow-md hover:shadow-xl transition-colors duration-150 text-lg text-white'
            >
              <GoSignOut className=''/>

          </button>
          </div>
        </div>
    </nav>

    <section id="call-history">

    </section>

  </div>

  );
};


export default CallDetailView;
