import React, { useState } from 'react';
import './room.css';

import RoomPreCall from './room-precall';
import RoomCall from './room-call';

const Room: React.FC = () => {
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [videoStream, setVideoStream] = useState<MediaStream>();
  const [showPrecall, setShowPrecall] = useState<boolean>();

  // Connection To Web
  return (
    <div className="room">{showPrecall ? <RoomPreCall /> : <RoomCall />}</div>
  );
};

export default Room;
