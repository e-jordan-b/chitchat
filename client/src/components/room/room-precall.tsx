import React from 'react';
import './room-precall.css';

const RoomPreCall: React.FC<{
  onJoin: () => void;
  mediaStream: MediaStream | undefined;
}> = ({ mediaStream }) => {
  // Deal with audio stream and video stream
  // Maybe you dont need the audio stream
  return <div className="roomprecall"></div>;
};

export default RoomPreCall;
