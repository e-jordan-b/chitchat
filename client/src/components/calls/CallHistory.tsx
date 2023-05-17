import React, { useEffect, useState, useContext } from 'react';

import title from '../../assets/ChitChat.png'
import { useNavigate, useLoaderData } from 'react-router-dom';
import { GoSignOut } from 'react-icons/go'
import {AiOutlineHome} from 'react-icons/ai'
import { UserContext } from '../../user/user-context';
import AuthService from '../../services/auth-service';

export const loader = () => {
  return ["mimmimi"]
}


const CallHistory: React.FC = () => {
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





    <section id="call-history">

    </section>



  );
};


export default CallHistory;
