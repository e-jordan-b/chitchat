import React from 'react';
import './room-call.css';

const RoomCall: React.FC<{
  audioStream: MediaStream | undefined;
  videoStream: MediaStream | undefined;
}> = ({ audioStream, videoStream }) => {
  // Also have to handle polling for summaries
  return <div className="roomcall"></div>;
};

export default RoomCall;
