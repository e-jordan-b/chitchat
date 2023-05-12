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
  const audioRecorder = useRef<MediaRecorder>();
  const renderCount = useRef<number>(0);
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
        connectSocket(url!, 'Federico', startMediaRecorder, stopMediaRecorder);
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

  // Spuns out a new mediarecorder object
  const startMediaRecorder = (socket: WebSocket) => {
    console.log('entered start media recorder');
    console.log(socket);
    if (!stream) return;

    console.log('passed first check');

    if (audioRecorder.current) {
      audioRecorder.current.stop();
    }

    console.log('passed second check');
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    console.log('passed third check');

    const audioStream = new MediaStream();
    audioStream.addTrack(audioTracks[0]);

    const options: MediaRecorderOptions = {
      mimeType: 'audio/webm; codecs=opus',
    };
    const recorder = new MediaRecorder(audioStream, options);
    recorder.addEventListener('dataavailable', (event) => {
      if (event.data && event.data.size > 0) {
        socket?.send(event.data);
      }
    });

    recorder.addEventListener('start', () => {
      console.log('room/audioRecorder: Recorder STARTED');
    });

    recorder.addEventListener('stop', () => {
      console.log('room/audioRecorder: Recorder STOPPED');
    });

    audioRecorder.current = recorder;
    audioRecorder.current.start(1000);
  };

  const stopMediaRecorder = () => {
    audioRecorder.current?.stop();
    audioRecorder.current = undefined;
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
