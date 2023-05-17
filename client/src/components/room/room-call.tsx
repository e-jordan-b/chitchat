import React, { useEffect, useMemo, useRef, useState } from 'react';
import './room-call.css';
import useRTCSocket from '../../hooks/use-rtc-socket';
import RoomCallControls from './room-call-controls';
import RoomLiveMenu from './room-live-menu';

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
  const { connectSocket } = useRTCSocket();
  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream()
  );
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isOtherVideoLoaded, setOtherVideoLoaded] = useState(false);

  useEffect(() => {
    const remoteVideoElement = remoteVideoRef.current;
    remoteVideoElement?.addEventListener('loadeddata', handleOtherVideoLoad);

    return () => {
      remoteVideoElement?.removeEventListener(
        'loadeddata',
        handleOtherVideoLoad
      );
    };
  }, []);

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

  const styles =
    'flex flex-col w-full h-full rounded-md transition-all transform duration-300 object-cover'; //border-dashed  text-gray-900 text-xl  border-gray-900

  const handleOtherVideoLoad = () => {
    setOtherVideoLoaded(true);
  };

  // Also have to handle polling for summaries
  return (
    <div className="flex h-screen w-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex h-full w-full">
          <main className="w-full h-full flex flex-col justify-center bg-background-black-call overflow-x-hidden overflow-y-auto mb-20">
            <div className="flex w-full justify-center align-center bg-background-black-call">
              {/* <nav className=""></nav> */}
            </div>
            <div className="relative flex w-full h-5/6 mx-auto px-6 mt-6 bg-background-black-call">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className={
                  isOtherVideoLoaded
                    ? 'transition-all h-56 duration-300 absolute bottom-5 right-10 text-gray-900 rounded-lg shadow-lg z-50' //border-gray-900 border-dashed text-xl border-4
                    : styles
                }
                style={{ scale: '-1 1 1' }}
              ></video>
              <video
                ref={remoteVideoRef}
                autoPlay
                className={
                  isOtherVideoLoaded
                    ? 'flex flex-col w-full h-full text-gray-900 rounded-lg object-cover' // border-green-900 border-dashed border-4 text-xl
                    : 'hidden'
                }
                style={{ scale: '-1 1 1' }}
              ></video>
            </div>
            <div className="flex flex-col w-full h-36 justify-center items-center bg-background-black-call">
              <RoomCallControls />
            </div>
          </main>
            <nav className="max-w-[500px] w-full h-full">
              <RoomLiveMenu url={urlMemo}/>
            </nav>
        </div>
      </div>
    </div>
  );
};

export default RoomCall;
