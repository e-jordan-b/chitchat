import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from './user/user-context';
import { useAuth } from './hooks/use-auth';

import Room from './components/room/room';
import Landing from './components/landing/landing';
import CallHistory from './components/calls/CallHistory';

import CallDetailView from './components/calls/CallDetailView';
import CallsLayout from './components/calls/CallsLayout';

export default function App() {
  const { user, setUser } = useAuth();

  console.log('USER', user);

  return (
    <UserContext.Provider
      value={{ user: user, update: (user) => setUser(user) }}
    >
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Landing />} />
            <Route path="/room" element={<Room />} />

            <Route path="/calls" element={ <CallsLayout/>} >
              <Route path=":userId" element={<CallHistory />} />
              <Route path="call/:callId" element={<CallDetailView />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
