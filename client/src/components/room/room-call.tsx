import React, { useEffect, useMemo, useRef, useState } from 'react';
import './room-call.css';
import useRTCSocket from '../../hooks/use-rtc-socket';

const SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302'],
    },
  ],
};

const RoomCall: React.FC<{
  url: string;
  mediaStream: MediaStream | undefined;
}> = ({ url, mediaStream }) => {
  const urlMemo = useMemo(() => url, [url]);
  const [peerConnection, _] = useState<RTCPeerConnection>(
    new RTCPeerConnection(SERVERS)
  );
  const { socket, socketStatus, connectSocket } = useRTCSocket();
  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream()
  );
  const [offer, setOffer] = useState<string>('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('STREAM EXISTS', mediaStream !== undefined);
    console.log('USE MEMO HAS CHANGED');
    connectSocket(
      url,
      handlePeerJoined,
      handleOfferReceived,
      handleAnswerReceived,
      handleCandidateReceived
    );
  }, [useMemo]);

  useEffect(() => {
    if (localVideoRef.current && mediaStream) {
      localVideoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  useEffect(() => {
    if (remoteVideoRef.current && mediaStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    console.log('PEER CONNECTION CREATED');
  }, [peerConnection]);

  useEffect(() => {
    console.log(offer);
  }, [offer]);

  const setupPeerConnection = (socket: WebSocket) => {
    // We add tracks to the connection
    mediaStream?.getTracks().forEach((track) => {
      const senders = peerConnection.getSenders();
      if (senders.length) {
        senders.forEach((sender) => peerConnection.removeTrack(sender));
      }

      peerConnection.addTrack(track, mediaStream);
    });

    // We add tracks to the remote stream
    const remoteTracks = remoteStream.getTracks();
    if (remoteTracks.length) {
      remoteTracks.forEach((track) => remoteStream.removeTrack(track));
    }

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    // We push candidates
    peerConnection.onicecandidate = (event) => {
      socket.send(
        JSON.stringify({ type: 'Candidate', payload: event.candidate })
      );
    };
  };

  const handlePeerJoined = async (socket: WebSocket) => {
    setupPeerConnection(socket);
    await createOffer(socket);
  };

  const createOffer = async (socket: WebSocket) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.send(JSON.stringify({ type: 'Offer', payload: offer }));
  };

  const handleOfferReceived = async (offer: any, socket: WebSocket) => {
    setupPeerConnection(socket);
    await createAnswer(offer, socket);
  };

  const createAnswer = async (offer: any, socket: WebSocket) => {
    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.send(JSON.stringify({ type: 'Answer', payload: answer }));
  };

  const handleAnswerReceived = async (answer: any) => {
    await peerConnection.setRemoteDescription(answer);
  };

  const handleCandidateReceived = async (candidate: any) => {
    await peerConnection.addIceCandidate(candidate);
  };

  // Also have to handle polling for summaries
  return (
    <div className="roomcall">
      <video
        className="h-[300px] w-full"
        style={{ height: '300px', width: '100%' }}
        ref={localVideoRef}
        autoPlay
      />
      <video
        style={{ height: '300px', width: '100%' }}
        ref={remoteVideoRef}
        autoPlay
      />
    </div>
  );
};

export default RoomCall;
