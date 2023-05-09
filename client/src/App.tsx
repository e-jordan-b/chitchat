//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
// import './App.css';
// import { blob } from 'stream/consumers';
// import Call from './Call3';

// function App() {
//   const [socket, _] = useState<WebSocket>(
//     new WebSocket('ws://localhost:3001/')
//   );
//   const audioRef1 = useRef<HTMLAudioElement>(null);

//   socket.onopen = () => {
//     setupStreaming(socket);

//   };



//   const setupStreaming = async (socket: WebSocket) => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: { channelCount: 1, sampleRate: 16000 },
//     });

//     const recorderChunks: Blob[] = [];
//     const options: MediaRecorderOptions = {
//       mimeType: 'audio/webm; codecs=opus',
//     };

//     const mediaRecorder = new MediaRecorder(stream, options);
//     mediaRecorder.ondataavailable = (event: BlobEvent) => {
//       if (event.data && event.data.size > 0) {
//         recorderChunks.push(event.data);
//         socket.send(event.data);
//       }
//     };
//     mediaRecorder.onstart = () => {
//       console.log('Started recording');
//     };
//     mediaRecorder.start(1000);

//     setTimeout(() => {
//       const audio = new Blob(recorderChunks, { type: 'audio/webm' });
//       const audioURL = window.URL.createObjectURL(audio);
//       audioRef1.current!.src = audioURL;
//     }, 5000);
//   };

  // useEffect(() => {
  //   console.log('Enumerating streams');
  //   const micId =
  //     'd8fec6ff172c0b093383e837bb515845a0b3d0f2a3e1c675f1dbc0b36e0ac6ad';

  //   const fire = async () => {
  //     // const devices = await enumerateDevices();
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: { deviceId: micId },
  //     });

  //     // const audioContext = new AudioContext();
  //     // const analyser = audioContext.createAnalyser();
  //     // const microphone = audioContext.createMediaStreamSource(stream);
  //     // const scriptProcessor = audioContext.createSccre

  //     const recorderChunks: Blob[] = [];
  //     const options = {
  //       sampleRate: 48000,
  //       echoCancellation: true,
  //       noiseSuppression: true,
  //       channelCount: 1,
  //       mimeType: 'audio/webm; codecs=opus',
  //     };
  //     const mediaRecorder = new MediaRecorder(stream, options);
  //     mediaRecorder.ondataavailable = (blobEvent: BlobEvent) => {
  //       if (blobEvent.data && blobEvent.data.size > 0) {
  //         console.log(blobEvent.data);
  //         recorderChunks.push(blobEvent.data);

  //         if (socket.readyState === WebSocket.OPEN) {
  //           console.log(blobEvent.data);
  //         }
  //       }
  //     };
  //     mediaRecorder.onstart = () => {
  //       console.log('Started recording');
  //     };
  //     mediaRecorder.onstop = () => {
  //       //
  //     };
  //     mediaRecorder.start(1000);

  //     // setInterval(() => {
  //     //   console.log('Pushin AUDIO');
  //     //   console.log(audioSet.current);
  //     //   console.log(recorderChunks.length);
  //     //   // If you splice you remove the metadata and can't form the second url correctly
  //     //   // const data = recorderChunks.splice(0, recorderChunks.length);
  //     //   const blob = new Blob(recorderChunks, { type: 'audio/webm' });

  //     //   const asyncBlob = async (blob: Blob) => {
  //     //     const buffer = await blob.text();
  //     //     console.log(buffer.toString());
  //     //   };

  //     //   // asyncBlob(blob);

  //     //   const buffer = blob.text.toString();
  //     //   console.log(buffer);
  //     //   const audioURL = window.URL.createObjectURL(blob);

  //     //   console.log(audioURL);

  //     //   if (audioSet.current === 0 && audioRef1.current) {
  //     //     console.log('IN 1');
  //     //     audioRef1.current.src = audioURL;
  //     //   }

  //     //   if (audioSet.current === 1 && audioRef2.current) {
  //     //     console.log('IN 2');
  //     //     audioRef2.current.src = audioURL;
  //     //   }

  //     //   audioSet.current++;
  //     // }, 5000);

  //     // setTimeout(() => {
  //     //   mediaRecorder.stop();
  //     // }, 10000);
  //   };

  // enumerateDevices();
  //   fire();
  // }, []);

  // const enumerateDevices = async (): Promise<MediaDeviceInfo[]> => {
  //   await navigator.mediaDevices.getUserMedia({ audio: true });
  //   const devices = await navigator.mediaDevices.enumerateDevices();
  //   console.log('-----');
  //   devices.forEach((device) => {
  //     console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
  //   });
  //   return devices;
  // };

  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, doc, setDoc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import './call.css'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCtVo2gU7eBFsW4RqhMnoC6_qghEaahRI",
  authDomain: "test2-876c9.firebaseapp.com",
  projectId: "test2-876c9",
  storageBucket: "test2-876c9.appspot.com",
  messagingSenderId: "720642594094",
  appId: "1:720642594094:web:c1acb8640d990c64ac56bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers)

const App: React.FC = () => {
  // return (
  //   <div className="App">
  //     {/* <audio ref={audioRef1} controls={true} /> */}
  //     {/* <audio ref={audioRef2} controls={true} /> */}
  //     <Call/>
  //   </div>
  // );
  const [currentPage, setCurrentPage] = useState("home");
  const [joinCode, setJoinCode] = useState("");

  return (
      <div className="app">
          {currentPage === "home" ? (
              <Menu
                  joinCode={joinCode}
                  setJoinCode={setJoinCode}
                  setPage={setCurrentPage}
              />
          ) : (
              <Videos
                  mode={currentPage}
                  callId={joinCode}
                  setPage={setCurrentPage}
              />
          )}
      </div>
  );
}

interface props {
  joinCode: any,
}

const Menu: React.FC = ({joinCode, setPage, setJoinCode}) => {
  return (
    <div className="home">
        <div className="create box">
            <button onClick={() => setPage("create")}>Create Call</button>
        </div>

        <div className="answer box">
            <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Join with code"
            />
            <button onClick={() => setPage("join")}>Answer</button>
        </div>
    </div>
  );
}

const Videos: React.FC = ({mode, callId, setPage}) => {
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);
  console.log(roomId)
  const localRef = useRef();
  const remoteRef = useRef();

  const setupSources = async () => {
    const  localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    })

    pc.ontrack = (event) => {
      console.log('im HHEEEEERE')
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true)

    if(mode === "create") {
      const callDoc = doc(collection(db, "calls"));
      const offerCandidates = collection(callDoc, 'offerCandidates');
      const answerCandidates = collection(callDoc, 'answerCandidates');

      setRoomId(callDoc.id)

      pc.onicecandidate = (event) => {
        event.candidate &&
          addDoc(offerCandidates, event.candidate.toJSON())
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type
      };

      await setDoc(callDoc, { offer })

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if(!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer)
          pc.setRemoteDescription(answerDescription);
        }
      })

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === 'added') {
            let data = change.doc.data()
            pc.addIceCandidate(new RTCIceCandidate(data))
          }
        })
      })
    } else if (mode === 'join') {
      const callDoc = doc(collection(db, 'calls'), callId);
      const answerCandidates = collection(callDoc, 'answerCandidates');
      const offerCandidates = collection(callDoc, 'offerCandidates');

      pc.onicecandidate = (event) => {
        event.candidate &&
          addDoc(answerCandidates, event.candidate.toJSON())
      }

      const callData = (await getDoc(callDoc)).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription))

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription)

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp
      }

      await updateDoc(callDoc, { answer })

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === 'added') {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data))
          }
        })
      })
    }
    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === 'disconnected') {
        hangUp()
      }
    }
  }
  //change syntax test test test
  const hangUp = async () => {
    pc.close();

    if(roomId) {
      let roomRef = doc(collection(db, 'calls'), roomId);
      await roomRef.collection('anwerCandidates')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete()
          })
        })
      await roomRef.collection('offerCandidates')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete()
          })
        })
      await roomRef.delete()
    }
    window.location.reload()
  }

  return (
    <div className="videos">
        <video
            ref={localRef}
            autoPlay
            playsInline
            className="local"
            muted
        />
        <video ref={remoteRef} autoPlay playsInline className="remote" />

        <div className="buttonsContainer">
            <button
                onClick={hangUp}
                disabled={!webcamActive}
                className="hangup button"
            >
                {/* <HangupIcon /> */}
            </button>
            <div tabIndex={0} role="button" className="more button">
                {/* <MoreIcon /> */}
                <div className="popover">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(roomId);
                        }}
                    >
                        {/* <CopyIcon />  */}
                        Copy joining code
                    </button>
                </div>
            </div>
        </div>

        {!webcamActive && (
            <div className="modalContainer">
                <div className="modal">
                    <h3>
                        Turn on your camera and microphone and start the
                        call
                    </h3>
                    <div className="container">
                        <button
                            onClick={() => setPage("home")}
                            className="secondary"
                        >
                            Cancel
                        </button>
                        <button onClick={setupSources}>Start</button>
                    </div>
                </div>
            </div>
        )}
    </div>
);

}

export default App;
