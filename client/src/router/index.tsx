
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Protected from '../components/Protected';
import Landing from '../pages/Landing';

//public routes
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import { ErrorPage } from '../pages/ErrorPage';

import PreCallRoom from '../routes/PreCallRoom';

import PreCallScreen from '../routes/Call';

// protected routes
import RootLayout from '../layouts/RootLayout';
import Call from '../components/webRtc/Call';
import Dashboard from '../routes/Dashboard';
import Settings from '../routes/Settings';
import Conversations from '../routes/Conversations';
import ConversationsLayout from '../layouts/ConversationLayout';
import Profile from '../routes/Profile';
import Chat from '../routes/Chat';

//dataLoaders
import { loader as conversationsLoader } from '../routes/Conversations';


export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Landing/>} />
    <Route path="/terms" element={<TermsAndConditions/>} errorElement={<ErrorPage />}/>
    <Route path="/privacy" element={<PrivacyPolicy/>} errorElement={<ErrorPage />}/>

    <Route path="/join" element={<PreCallRoom/>} />
    {/* //like google meets with a staging area that redicres
    to the call once the connection has been established? */}
    <Route path="/:roomId" element={<Call/>} />



    <Route path="/app" element={<Protected><RootLayout/></Protected>} >

      <Route path="dashboard" element={<Dashboard/>} />
      <Route path="me" element={<Profile/>} />
      <Route path="chat" element={<Chat/>} />

      <Route path="conversations" element={<Conversations/>} loader={conversationsLoader}/>
        <Route path="conversation/:conversationId" element={<ConversationsLayout/>} />
      <Route />

      <Route path="createCall" element={<PreCallScreen/>} />
      <Route path="room/:roomId" element={<Call/>} />
      <Route path="settings" element={<Settings/>} />

    </Route>





    <Route path="*" element={<h1>Not Found</h1>} />

    </>
)
)