import './room-precall.css';
import React, { useState, useRef, useEffect, useCallback } from "react"
import { db } from '../../firebase';
import { collection, getDoc, doc, setDoc, addDoc, onSnapshot, updateDoc, getDocs, deleteDoc } from 'firebase/firestore'
import './room-call.css';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10,
};

const peerConnection = new RTCPeerConnection(servers);

const RoomPreCall: React.FC<{
  mediaStream: MediaStream | undefined;
}> = ({ mediaStream }) => {

  // Deal with audio stream and video stream
  // Maybe you dont need the audio stream
  const mediaRef = useRef<HTMLVideoElement>(null);
  if (mediaRef.current && mediaStream) mediaRef.current.srcObject = mediaStream;

  


  return (
    <>
    <div className="h-screen w-screen flex justify-center items-center">
          <video
            className={ ` w-screen h-5/6 rounded-md border-3 drop-shadow-lg `}
            ref={mediaRef}
            autoPlay
            muted
            playsInline></video>


        <div className={`flex flex-col items-center justify-center h-screen`}>
          <button
            className={`bg-cyan-400 rounded-md w-24`}
            // onClick={}
          >
            Join
          </button>
        </div>
      </div>
    </>

  )
};

export default RoomPreCall;
