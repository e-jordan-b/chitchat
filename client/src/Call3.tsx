import React, { useState, useRef } from "react"
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, doc, setDoc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore'

let initialState = {
  callButtonDisable: true,
  answerButtonDisable: false,
  webcamButtonDisable: false,
  hangupButtonDisable: true
}

const Call: React.FC = () => {
  const [disabled, setDisabled] = useState(initialState);
  const videoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const firebaseConfig = {
    apiKey: "AIzaSyDsYKaXtjxhueQL_tlKwYRFffeFZidWLGU",
    authDomain: "videocall-77bc8.firebaseapp.com",
    projectId: "videocall-77bc8",
    storageBucket: "videocall-77bc8.appspot.com",
    messagingSenderId: "416852717529",
    appId: "1:416852717529:web:ed6188b4975e206d0173c8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Global state
  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
    ],
    iceCandidatePoolSize: 10,
  };


  let pc = new RTCPeerConnection(servers);

  const callInput = document.querySelector('#callInput') as HTMLInputElement;

  const HandleWebcamButtonClick = async () => {
    // var constraints = { audio: true, video: { width: 1280, height: 720 } };
    // navigator.mediaDevices
    //   .getUserMedia(constraints)
    //   .then(function(localStream) {
    //     let video = document.querySelector("#webcamVideo") as HTMLVideoElement;
    //     console.log(localStream, 'localStream')
    //     video.srcObject = localStream;

    //     localStream.getTracks().forEach(track => {
    //       pc.addTrack(track, localStream);
    //     })
    //   })
    //   .catch(function(err) {
    //     console.log(err.name + ": " + err.message);
    //   }); // always check for errors at the end.

    // initalizing the remote server to the mediastream


    let remoteStream: MediaStream = new MediaStream();

    let localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    pc.ontrack = (event) => {
      console.log('im HHEEEEERE')
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    })


    // displaying the video data from the stream to the webpage
    // let remoteVideo = document.querySelector('#remoteVideo') as HTMLVideoElement;
    console.log(remoteStream, "mediaastreeeam")
    // remoteVideo.srcObject = remoteStream;

    if(localVideoRef.current){
      localVideoRef.current.srcObject = localStream;
      // localVideoRef.current.play()
    }
    if(remoteStream && videoRef.current){
      console.log('insideVideoRefCurrent')
      videoRef.current.srcObject = remoteStream;
      videoRef.current.play()
    }
    // if(videoRef.current) videoRef.current.srcObject = remoteStream
    // enabling and disabling interface based on the current condtion
    let afterClickState = {
      callButtonDisable: false,
      answerButtonDisable: false,
      webcamButtonDisable: true,
      hangupButtonDisable: true
    }
    setDisabled(afterClickState);
  }

  const handleCallButtonClick = async () => {
    // Reference Firestore collection
    const callDocRef = doc(collection(db, "calls"))
    const offerCandidates = collection(callDocRef, 'offerCandidates')
    const answerCandidates = collection(callDocRef, 'answerCandidates')
    //When referencing a document without ID firebase creates a new generated Id
    callInput.value = callDocRef.id;

    // Get candidates for caller, save to db
    pc.onicecandidate = event => {
      console.log('IM ON ICECANDIDATE')
      if(event.candidate){
        const candidateJson = event.candidate.toJSON();
        addDoc(offerCandidates, candidateJson);
      }
    };

    //Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDocRef, offer);

    // Listen for remote answer
    onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      // console.log('CALLDOCREF DATA', data)
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription)
      }
    });

    // When answered, add candidate to peer connection
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change, 'change')
        if(change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      })
    });

  }

  const handleAnswerButtonClick = async () => {
    const callId = callInput.value;
    const callDoc = doc(collection(db, 'calls'), callId);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');

    pc.onicecandidate = event => {
      if(event.candidate){
        const candidateJson = event.candidate.toJSON();
        addDoc(answerCandidates, candidateJson);
      }
    };

    const callSnapshot = await getDoc(callDoc);
    const callData = callSnapshot.data();
    if (callData) {
      const { type, sdp } = callData;
      const remoteSessionDescription = new RTCSessionDescription({ type, sdp });
      await pc.setRemoteDescription(remoteSessionDescription);
    };

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer })

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log('CHAAAANGE' , change)
        if(change.type === 'added') {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data))
          console.log('on offercandidates addicecandidate')
        }
      })
    })
  }

  return (
    <>
      <h2>1. Start your Webcam</h2>
      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video id="webcamVideo" ref={localVideoRef} autoPlay playsInline></video>
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video id="remoteVideo" ref={videoRef} autoPlay playsInline></video>
        </span>


      </div>

      <button id="webcamButton" onClick={HandleWebcamButtonClick} disabled={disabled.webcamButtonDisable}>Start webcam</button>
      <h2>2. Create a new Call</h2>
      <button id="callButton" onClick={handleCallButtonClick} disabled={disabled.callButtonDisable}>Create Call (offer)</button>

      <h2>3. Join a Call</h2>
      <p>Answer the call from a different browser window or device</p>

      <input id="callInput" />
      <button id="answerButton" onClick={handleAnswerButtonClick} disabled={disabled.answerButtonDisable}>Answer</button>

      <h2>4. Hangup</h2>

      <button id="hangupButton" disabled={disabled.hangupButtonDisable}>Hangup</button>
    </>
  )
}

export default Call