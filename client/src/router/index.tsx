/*

// import Landing from '../pages/Landing';
// //public routes
// import PrivacyPolicy from '../pages/PrivacyPolicy';
// import TermsAndConditions from '../pages/TermsAndConditions';
// import PreCallScreen from '../routes/Call';
// // protected routes
// import RootLayout from '../layouts/RootLayout';
// import Call from '../components/Call';


// import Login from '../components/Login';

*/
import Conversations from '../routes/Conversations';
import Settings from '../routes/Settings';
import RootLayout from '../layouts/RootLayout';
import Dashboard from '../routes/Dashboard';
import Protected from '../components/Protected';
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import PreCall from '../components/PreCall'
// import CallNew from '../components/CallNew'
import LandingPage from '../components/LandingPage'
import AgendaCreationScreen from '../components/AgendaCreationScreen'

// import Call from '../components/CallOld'
// import Con
import ConditionalRendering from '../components/ConditionalRendering'
import HomePage from '../pages/HomePage'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    {/*
    <Route path="/terms" element={<TermsAndConditions/>} />
    <Route path="/privacy" element={<PrivacyPolicy/>} />
    <Route path='/login' element={<Login/>}/>



    */}

    <Route path="/" element={<HomePage/>} />
    <Route path='/call' element={<LandingPage/>} />
    <Route path="/call/:callId" element={<ConditionalRendering/>} />

    <Route path='/call/agenda' element={<AgendaCreationScreen/>} />

    <Route path="/app" element={
      <Protected>
        <RootLayout/>
      </Protected>
    } >

      <Route index element={<Dashboard/>} />
      <Route path="dashboard" element={<Dashboard/>} />

      <Route path="conversations" element={<Conversations/>} />
      <Route path="settings" element={<Settings/>} />
    </Route>

    <Route path="*" element={<h1>Not Found</h1>} />
  </>
)
)