import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import HomePage from '../pages/HomePage'
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';

import RootLayout from '../layouts/RootLayout';
import Protected from '../components/Protected';
import Dashboard from '../routes/Dashboard';
import UserCallPage from '../components/UserCallPage';
import AgendaCreationScreen from '../components/AgendaCreationScreen'
import Conversations from '../routes/Conversations';
import Chat from '../routes/Chat';
import Settings from '../routes/Settings';
import Profile from '../routes/Profile';

import PublicCallPage from '../components/PublicCallPage';

import ConditionalRendering from '../components/ConditionalRendering'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>

    {/* public routes */}
    <Route path="/" element={<HomePage/>} />
    <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
    <Route path="/terms-and-conditions" element={<TermsAndConditions/>} />

    <Route path='/join' element={<PublicCallPage/>} />
    <Route path="/call/:callId" element={<ConditionalRendering/>} />
    <Route path="*" element={<h1>Not Found</h1>} />

    <Route path="/app" element={<Protected><RootLayout/></Protected>} >
      <Route index element={<Dashboard/>} />
      <Route path="dashboard" element={<Dashboard/>} />
      <Route path='call' element={<UserCallPage/>} />
      <Route path='call/agenda' element={<AgendaCreationScreen/>} />
      <Route path="chat" element={<Chat/>} />
      <Route path="conversations" element={<Conversations/>} />
      <Route path="settings" element={<Settings/>} />
      <Route path="profile" element={<Profile/>} />
      <Route path="*" element={<h1>Sorry nothing here</h1>} />
    </Route>


  </>
)
)