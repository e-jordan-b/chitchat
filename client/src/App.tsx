import React, { useRef, useState } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { UserContext } from './user/user-context';
import title from './assets/Vector.png'

import { Provider } from 'react-redux'
import store from './store';

import Room from './components/room/room';
import { useAuth } from './hooks/use-auth';
import Landing from './components/landing/landing';

import UserCallSettings from './components/UserCallSettings';
import GuestCallSettings from './components/GuestCallSettings';
import AgendaCreation from './components/AgendaCreation';
import Start from './components/Call';

export default function App() {
  const { user, setUser, loading, error, fire } = useAuth();

  console.log('USER', user);



  return (
    <Provider store={store}>
      <UserContext.Provider
        value={{ user: user, update: (user) => setUser(user) }}
      >
        <BrowserRouter>
          <Routes>

            {/* <Route path="/" element={< Landing />} /> */}
              <Route element={< CallFlowLayout />} >
              <Route path="/call" element={< Start />} />
              <Route path="/settings" element={< UserCallSettings />} />
              <Route path="/agenda" element={< AgendaCreation />} />
              </ Route>


            <Route path="/join" element={< Start />} />
            <Route path="/settings/:url" element={< GuestCallSettings />} />
            <Route path="/room/:url(/:speaker)" element={< Room />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </Provider>
  );
}


const CallFlowLayout = () => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  };
  // const [date, setDate] = useState<Date>(new Date());

  const formattedDate = (new Date()).toLocaleString('en-US', options);
    return (
      <div className="min-w-[1/4] w-screen h-screen">
        <header>
          <nav className='flex flex-row h-24 w-full text-lg font-semibold text-gray-800 bg-custom-purple-50 '>
            <div className='flex flex-row h-24 min-h-fit'>
        {/* <img src={logo} alt='Logo' className=''></img> */}
              <img src={title} alt='chitchat title' className='ml-10 h-8 min-w-fit self-center '></img>
            </div>
            <div className="flex ml-auto mr-5 ">
              <div className='self-center hidden md:block'>{formattedDate}</div>
            <button className='
            float-right self-center ml-5 px-4 py-2 h-14 w-40 shadow-xl
            bg-custom-purple-500 rounded-md text-xl text-slate-100 hover:bg-custom-purple-800'
          // onClick={() => setShowAuth(true)}
            >Login</button>
          </div>
      {/* <AuthModal isVisible={showAuth} onClose={() => setShowAuth(false)} /> */}
        </nav>
      </header>
      <main className='h-full w-full flex justify-center item'>
        <Outlet />
      </main>

      </div>
    )
  }
