
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Protected from '../components/Protected';
import Landing from '../pages/Landing';

//public routes
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import { ErrorPage } from '../pages/ErrorPage';

import PreCallScreen from '../routes/Call';

// protected routes
import RootLayout from '../layouts/RootLayout';
import Call from '../components/Call';
import Dashboard from '../routes/Dashboard';
import Settings from '../routes/Settings';
import Conversations from '../routes/Conversations';
import ConversationsLayout from '../layouts/ConversationLayout';

//dataLoaders
import { loader as conversationsLoader } from '../routes/Conversations';


export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Landing/>} />
    <Route path="/terms" element={<TermsAndConditions/>} errorElement={<ErrorPage />}/>
    <Route path="/privacy" element={<PrivacyPolicy/>} errorElement={<ErrorPage />}/>

    <Route path="/app" element={<Protected><RootLayout/></Protected>} >
      <Route path="dashboard" element={<Dashboard/>} />
      <Route path="conversations" element={<Conversations/>} loader={conversationsLoader}/>
        <Route path="conversation/:conversationId" element={<ConversationsLayout/>} />
      <Route />
      <Route path="call" element={<PreCallScreen/>} />
    <Route/>

      <Route path="settings" element={<Settings/>} />
    </Route>


    <Route path="/room/:roomId" element={<PreCallScreen/>} />
    <Route path="*" element={<h1>Not Found</h1>} />

    </>
)
)