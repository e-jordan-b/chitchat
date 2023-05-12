import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useMediaStream from '../../hooks/useMediaStream';
import './room.css';

import RoomPreCall from './room-precall';
import RoomCall from './room-call';

const Room: React.FC = () => {
  const { stream, error } = useMediaStream();
  // const [audioStream, setAudioStream] = useState<MediaStream>();
  // const [videoStream, setVideoStream] = useState<MediaStream>();
  const [showPrecall, setShowPrecall] = useState<boolean>(true);
  const [searchParams, _] = useSearchParams();

  // Check if searchParams are good
  // VALIDATE SEARCH PARAMS

  // Stream ERROR
  // USER CANNOT JOIN STREAM

  // SOCKET CONNECTION
  // We listen here for updates
  // IF STARTED => We record and push the audio stream
  // IF PAUSED => We stop the media stream

  console.log('RENDERED');
  console.log('url', searchParams.get('url'));
  console.log('ERROR', error);

  // Call the permission at this point

  // Once we receive STARTED from BE
  // We have to push the audio stream, through the recorder

  // Connection To Web
  return (
    <div className="room">
      {/* {showPrecall ? (
        <RoomPreCall audioStream={audioStream} videoStream={videoStream} />
      ) : (
        <RoomCall audioStream={audioStream} videoStream={videoStream} />
      )} */}
    </div>
  );
};

export default Room;
