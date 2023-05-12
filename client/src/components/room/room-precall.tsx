import React from 'react';
import './room-precall.css';

const RoomPreCall: React.FC<{
  audioStream: MediaStream | undefined;
  videoStream: MediaStream | undefined;
}> = ({ audioStream, videoStream }) => {
  // Deal with audio stream and video stream
  // Maybe you dont need the audio stream
  return <div className="roomprecall"></div>;
};

export default RoomPreCall;
