// import React, { useEffect, useRef,  } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import { blob } from 'stream/consumers';

// console.log('a')

// function App() {
//   const audioRef1 = useRef<HTMLAudioElement>(null);
//   const audioRef2 = useRef<HTMLAudioElement>(null);
//   const audioSet = useRef<number>(0);

//   useEffect(() => {
//     console.log('Enumerating streams');
//     const micId =
//       'd8fec6ff172c0b093383e837bb515845a0b3d0f2a3e1c675f1dbc0b36e0ac6ad';

//     const fire = async () => {
//       // const devices = await enumerateDevices();
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: { deviceId: micId },
//       });

//       // const audioContext = new AudioContext();
//       // const analyser = audioContext.createAnalyser();
//       // const microphone = audioContext.createMediaStreamSource(stream);
//       // const scriptProcessor = audioContext.createSccre

//       const recorderChunks: Blob[] = [];
//       const options = {
//         audioBitsPerSecond: 128000,

//         mimeType: 'audio/webm',
//       };
//       const mediaRecorder = new MediaRecorder(stream, options);
//       mediaRecorder.ondataavailable = (blobEvent: BlobEvent) => {
//         if (blobEvent.data && blobEvent.data.size > 0) {
//           recorderChunks.push(blobEvent.data);
//         }
//       };
//       mediaRecorder.onstart = () => {
//         console.log('Started recording');
//       };
//       mediaRecorder.onstop = () => {
//         //
//       };
//       mediaRecorder.start(1000);

//       setInterval(() => {
//         console.log('Pushin AUDIO');
//         console.log(audioSet.current);
//         console.log(recorderChunks.length);
//         // If you splice you remove the metadata and can't form the second url correctly
//         // const data = recorderChunks.splice(0, recorderChunks.length);
//         const blob = new Blob(recorderChunks, { type: 'audio/webm' });

//         const asyncBlob = async (blob: Blob) => {
//           const buffer = await blob.text();
//           console.log(buffer.toString());
//         };

//         // asyncBlob(blob);

//         const buffer = blob.text.toString();
//         console.log(buffer);
//         const audioURL = window.URL.createObjectURL(blob);

//         console.log(audioURL);

//         if (audioSet.current === 0 && audioRef1.current) {
//           console.log('IN 1');
//           audioRef1.current.src = audioURL;
//         }

//         if (audioSet.current === 1 && audioRef2.current) {
//           console.log('IN 2');
//           audioRef2.current.src = audioURL;
//         }

//         audioSet.current++;
//       }, 5000);

//       // setTimeout(() => {
//       //   mediaRecorder.stop();
//       // }, 10000);
//     };

//     enumerateDevices();
//     fire();
//   }, []);

//   const enumerateDevices = async (): Promise<MediaDeviceInfo[]> => {
//     await navigator.mediaDevices.getUserMedia({ audio: true });
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     console.log('-----');
//     devices.forEach((device) => {
//       console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
//     });
//     return devices;
//   };

//   return (
//     <div className="App">
//       <audio ref={audioRef1} controls={true} />
//       <audio ref={audioRef2} controls={true} />
//     </div>
//   );
// }

import React, { Dispatch, FC, useEffect } from "react";
import dbRef, { userName, connectedRef } from "./server/firebase";
import {connect} from 'react-redux';
import { addParticipant, removeParticipant, setUser } from "./store/actionCreator";

interface AppProps {
  setUser: (user: { [key: string]: any }) => void;
  addParticipant: (participant: { [key: string]: any }) => void;
  removeParticipant: (participantId: string) => void;
  user: any,
  participants: any
}

const App: React.FC<AppProps> = (props:AppProps) => {
  const participantRef = dbRef.child('participants')
   useEffect(() => {
    connectedRef.on('value', snap => {
      if(snap.val()){
        const defaultPreferences = {
          audio: true,
          video: false,
          screen: false
        };
        const userRef = participantRef.push({
          userName,
          preferences: defaultPreferences
        });
        props.setUser({
          [userRef.key as string]: {
            userName,
            ...defaultPreferences,
          }
        })
        userRef.onDisconnect().remove();
      }
    })

  }, [])
  useEffect(() => {
    if(props.user) {
      participantRef.on('child_added', (snap) => {
        const {userName, preferences} = snap.val()
        props.addParticipant({
          [snap.key as string]: {
            userName,
            ...preferences
          }
        })
      })
      participantRef.on('child_removed', (snap) => {
        props.removeParticipant(snap.key as string)
        })
    }
  },[props.user])
  return (
    <h1>{JSON.stringify(props.user)}{JSON.stringify(props.participants)}</h1>
  )
}

const mapStateToProps = (state: any) => {
  return {
    user: state.currentUser,
    participants: state.participants,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setUser: (user: any) => dispatch(setUser(user)),
    addParticipant: (participant: any) => dispatch(addParticipant(participant)),
    removeParticipant: (participantKey: any) => dispatch(removeParticipant(participantKey)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
