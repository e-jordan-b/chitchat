import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useMediaStream from '../../hooks/use-media-stream';
import './room.css';

import RoomPreCall from './room-precall';
import RoomCall from './room-call';
import RoomService from '../../services/room-service';
import useMediaSocket from '../../hooks/use-media-socket';

enum RoomState {
  VALIDATE,
  PRECALL,
  CALL,
}

const Room: React.FC = () => {
  const [roomState, setRoomState] = useState<RoomState>(RoomState.VALIDATE);
  const { stream, error, requestPermissions } = useMediaStream();
  const { socket, connectSocket } = useMediaSocket();
  const renderCount = useRef<number>(0);
  // const [audioStream, setAudioStream] = useState<MediaStream>();
  // const [videoStream, setVideoStream] = useState<MediaStream>();
  const [searchParams, _] = useSearchParams();
  const roomService = new RoomService();

  renderCount.current++;

  console.log('RENDERED', renderCount.current);
  console.log(roomState);
  console.log('url', searchParams.get('url'));
  console.log('ERROR', error);
  console.log('STREAM', stream?.getTracks().length);

  // [ START RoomState Handling ]
  useEffect(() => {
    switch (roomState) {
      case RoomState.VALIDATE: {
        validateRoom();
        break;
      }
      case RoomState.PRECALL: {
        requestPermissions();
        break;
      }
      case RoomState.CALL: {
        console.log('Create WebSocketConnection');
        const url = searchParams.get('url');
        connectSocket(url!, 'Federico', socketOnMessage);
        break;
      }
    }
  }, [roomState]);

  const validateRoom = async () => {
    const url = searchParams.get('url');

    if (!url) {
      console.log('URL is Not valid');
      return;
    }

    const isValid = await roomService.isUrlValid(url);

    if (isValid) {
      setRoomState(RoomState.PRECALL);
    } else {
      console.log('Room is not valid');
      console.log('REDIRECT');
      // REDIRECT
    }
  };

  const socketOnMessage = async (ev: MessageEvent) => {
    const { callUpdate } = JSON.parse(ev.data) as {
      callUpdate: { status: string };
    };

    if (callUpdate.status === 'STARTED') {
      console.log('START MEDIA RECORDER');
    }

    if (callUpdate.status === 'PAUSED') {
      console.log('STOP MEDIA RECORDER');
    }
  };

  // [ END RoomState Handling ]

  // Check if searchParams are good
  // VALIDATE SEARCH PARAMS

  // Stream ERROR
  // USER CANNOT JOIN STREAM

  // SOCKET CONNECTION
  // We listen here for updates
  // IF STARTED => We record and push the audio stream
  // IF PAUSED => We stop the media strea

  // Call the permission at this point

  // Once we receive STARTED from BE
  // We have to push the audio stream, through the recorder

  // Connection To Web

  const RenderSwitch: React.FC = () => {
    switch (roomState) {
      case RoomState.VALIDATE: {
        return <div>LOADING</div>;
      }
      case RoomState.PRECALL: {
        return (
          <div>
            <button onClick={() => setRoomState(RoomState.CALL)}>
              START CALL
            </button>
          </div>
        );
      }
      case RoomState.CALL: {
        return null;
      }
    }
  };

  return (
    <div className="room">
      <RenderSwitch />
    </div>
  );
};

export default Room;
