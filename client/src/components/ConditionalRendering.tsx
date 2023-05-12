import React, { useState } from "react";
import Menu from "./CallMenu";
import Videos from "./CallVideos";
import '../call.css'
import Settings from './Seetings'
import PreCall from './PreCall';
import { useSelector, useDispatch,  } from 'react-redux'

import type { RootState } from '../store/index'
import CallNew from './CallNew';

const ConditionalRendering = () => {

  let hasJoined = useSelector((state: RootState) => state.videoCall.hasJoined)
  let isHost = useSelector((state: RootState) => state.videoCall.isHost)

  // Federicos original code within APP component
  // return (
  //   <div className="App">
  //     {/* <audio ref={audioRef1} controls={true} /> */}
  //     {/* <audio ref={audioRef2} controls={true} /> */}
  //     <Call/>
  //   </div>
  // );
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [joinCode, setJoinCode] = useState<string>("");



    console.log(currentPage)
  return (
    <div>
    {!hasJoined ? <CallNew/> : <Videos  mode={isHost ? 'create' : "join"} callId='12345'/>}
    </div>


      // <div className="app">
      //     {currentPage === "home" ? (
      //       //   <Menu
      //       //       joinCode={joinCode}
      //       //       setJoinCode={setJoinCode}
      //       //       setPage={setCurrentPage}
      //       //   />
      //       <Settings setCurrentPage={setCurrentPage}/>
      //     ) : (
      //         <Videos
      //             mode={currentPage}
      //             callId={joinCode}
      //             setPage={setCurrentPage}
      //         />
      //     )}
      // </div>
  );
}

export default ConditionalRendering


const TestComp = () => {
  return (
    <h1>Yay</h1>
  )
}