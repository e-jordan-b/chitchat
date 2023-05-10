import React, { useState } from "react";
import Menu from "./CallMenu";
import Videos from "./CallVideos";
import '../call.css'

const Call: React.FC = () => {
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

  return (
      <div className="app">
          {currentPage === "home" ? (
              <Menu
                  joinCode={joinCode}
                  setJoinCode={setJoinCode}
                  setPage={setCurrentPage}
              />
          ) : (
              <Videos
                  mode={currentPage}
                  callId={joinCode}
                  setPage={setCurrentPage}
              />
          )}
      </div>
  );
}

export default Call