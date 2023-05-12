import React, {useRef} from 'react';
import './room-precall.css';

const RoomPreCall: React.FC<{
  mediaStream: MediaStream | undefined;
}> = ({ mediaStream }) => {

  const mediaRef = useRef<HTMLVideoElement>(null);
  if (mediaRef.current && mediaStream) mediaRef.current.srcObject = mediaStream;
  // Deal with audio stream and video stream
  // Maybe you dont need the audio stream

  return (
    <>
    <div className="h-screen w-screen flex justify-center items-center">
          <video
            className={ ` w-screen h-5/6 rounded-md border-3 drop-shadow-lg `}
            ref={mediaRef}
            autoPlay
            muted
            playsInline></video>


        <div className={`flex flex-col items-center justify-center h-screen`}>
          <button
            className={`bg-cyan-400 rounded-md w-24`}
            onClick={()}
          >
            Join
          </button>
        </div>
      </div>
    </>

  )
};

export default RoomPreCall;
