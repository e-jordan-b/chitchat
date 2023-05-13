import React, { useEffect, useMemo, useState } from 'react';
import './room-call.css';
import useRTCSocket from '../../hooks/use-rtc-socket';

const RoomCall: React.FC<{
  url: string;
  mediaStream: MediaStream | undefined;
}> = ({ url, mediaStream }) => {
  const urlMemo = useMemo(() => url, [url]);
  const [peerConnection, _] = useState<RTCPeerConnection>(
    new RTCPeerConnection()
  );
  const { socket, socketStatus, connectSocket } = useRTCSocket();

  useEffect(() => {
    console.log('STREAM EXISTS', mediaStream !== undefined);
    console.log('USE MEMO HAS CHANGED');
    connectSocket(url, onMessage);
  }, [useMemo]);

  const onMessage = (ev: MessageEvent) => {
    console.log(ev.data);
  };

  // Also have to handle polling for summaries
  return <div className="roomcall"></div>;
};

export default RoomCall;
