import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useMediaStream from '../../hooks/use-media-stream';
import useMediaSocket from '../../hooks/use-media-socket';
import './room.css';

import RoomCall from './room-call';
import RoomService from '../../services/room-service';
import RoomPrecall from './room-precall';
import RoomLoading from './room-loading';

enum RoomState {
  VALIDATE,
  PRECALL,
  CALL,
}

const Room: React.FC = () => {
  const [roomState, setRoomState] = useState<RoomState>(RoomState.VALIDATE); // Switch back to VALIDATE
  const { stream, error, requestPermissions } = useMediaStream();
  const { connectSocket } = useMediaSocket();
  const audioRecorder = useRef<MediaRecorder>();
  const renderCount = useRef<number>(0);
  const [searchParams, _] = useSearchParams();
  const roomService = new RoomService();
  const speaker = useRef<string>('placeholder');
  const navigate = useNavigate();

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
        console.log(speaker.current);
        connectSocket(
          url!,
          speaker.current,
          startMediaRecorder,
          stopMediaRecorder
        );
        break;
      }
    }
  }, [roomState]);

  const validateRoom = async () => {
    const url = searchParams.get('url');

    if (!url) {
      navigate('/');
      return;
    }

    const isValid = await roomService.isUrlValid(url);

    if (isValid) {
      setRoomState(RoomState.PRECALL);
    } else {
      navigate('/');
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

  const onJoin = (name: string) => {
    speaker.current = name;
    setRoomState(RoomState.CALL);
  };

  const inputSpeaker = (name: string) => {
  }

  // [ END RoomState Handling ]

  const RenderSwitch: React.FC = () => {
    switch (roomState) {
      case RoomState.VALIDATE: {
        return <RoomLoading />;
      }
      case RoomState.PRECALL: {
        return <RoomPrecall onJoin={onJoin} mediaStream={stream} />

      }
      case RoomState.CALL: {
        const url = searchParams.get('url');
        if (!url) return null;

        return <RoomCall url={url} mediaStream={stream} speaker={speaker.current}/>;
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
