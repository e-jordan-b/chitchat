import { useContext, useEffect, useState } from "react"
import title from "../../assets/ChitChat.png"
import AuthService from '../../services/auth-service';
import { useNavigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../user/user-context';
import { GoSignOut } from 'react-icons/go'
import {AiOutlineHome} from 'react-icons/ai'

export default function CallDetailView() {
  const [date, setDate] = useState<Date>(new Date());
  const navigate = useNavigate()
  const authService = new AuthService();
  const {user, update} = useContext(UserContext);

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
    <section>
<Outlet/>

    </section>


  )
}
