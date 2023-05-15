import { useEffect, useState } from 'react'
import useMediaStream from '../../hooks/use-media-stream';

const RoomPreCall = ({onJoin}: {onJoin: () => void}) => {

  const { stream, error, requestPermissions } = useMediaStream();

  useEffect(() => {
    requestPermissions();
  }, []);

  // Deal with audio stream and video stream
  // Maybe you dont need the audio stream
  return (
  <div className=""><button onClick={onJoin}>join</button></div>
  )
};

export default RoomPreCall;
