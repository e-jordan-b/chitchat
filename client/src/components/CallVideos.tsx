import React, { useState, useRef } from "react"
import { useParams } from "react-router-dom";
import useFirebase from "../hooks/useFirebase";
// import useWebRtc from "../hooks/useWebRtc";
import { getFirestore, collection, getDoc, doc, setDoc, addDoc, onSnapshot, updateDoc, getDocs, deleteDoc } from 'firebase/firestore'
import '../call.css'


const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10,
};

const peerConnection = new RTCPeerConnection(servers)


interface videoProps {
  mode: string,
  callId: string,
  setPage: React.Dispatch<React.SetStateAction<string>>,
}

const Videos: React.FC<videoProps> = ({mode, callId, setPage}: videoProps) => {
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);
  // const {roomId} = useParams<{roomid: string}>()
  const { db } = useFirebase()
  // const db = getFirestore(app);



  console.log(roomId)
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  // UseEffect [] to run only once
  const setupSources = async () => {
    const  localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

  // ##############################

    const remoteStream = new MediaStream();

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = (event) => { // event is a MediaStreamTrackEvent? ReadonlyArray<MediaStream>?
      console.log('im HHEEEEERE')
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        })

        //remoteRef.current.srcObject = remoteStream;
    }

    if(localRef.current) localRef.current.srcObject = localStream;
    if(remoteRef.current) remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    // &role=host from url? const { role } = useParams()
    if(mode === "create") {
      // could this be extracted to the useFirebase hook?
      const callDoc = doc(collection(db, "calls"));
      // const {id} = doc(collection(db, "calls"));
      const offerCandidates = collection(callDoc, 'offerCandidates');
      const answerCandidates = collection(callDoc, 'answerCandidates');

      setRoomId(callDoc.id); // ask federico wtf the roomurl is

      peerConnection.onicecandidate = (event) => {
        event.candidate &&
          addDoc(offerCandidates, event.candidate.toJSON());
      };

      const offerDescription = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp, //RTCSessionDescription
        type: offerDescription.type
      };

      await setDoc(callDoc, { offer });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if(!peerConnection.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          peerConnection.setRemoteDescription(answerDescription);
        }
      })

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === 'added') {
            let data = change.doc.data()
            peerConnection.addIceCandidate(new RTCIceCandidate(data))
          }
        })
      })


    } else if (mode === 'join') {
      const callDoc = doc(collection(db, 'calls'), callId);
      const answerCandidates = collection(callDoc, 'answerCandidates');
      const offerCandidates = collection(callDoc, 'offerCandidates');

      peerConnection.onicecandidate = (event) => {
        event.candidate &&
          addDoc(answerCandidates, event.candidate.toJSON())
      }

      const callData = (await getDoc(callDoc)).data();

      const offerDescription = callData?.offer;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription))

      const answerDescription = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answerDescription)

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp
      }

      await updateDoc(callDoc, { answer })

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === 'added') {
            let data = change.doc.data();
            peerConnection.addIceCandidate(new RTCIceCandidate(data))
          }
        })
      })
    }

    peerConnection.onconnectionstatechange = (event) => {
      // kill the media recorder here?

      if (peerConnection.connectionState === 'disconnected') {
        hangUp()
      }
    }
  }
  //change syntax test test test
  const hangUp = async () => {
    peerConnection.close();

    if(roomId) {
      const roomRef = doc(db, 'calls', roomId);
      const answerCandidatesRef = collection(roomRef, 'answerCandidates');
      const offerCandidatesRef = collection(roomRef, 'offerCandidates');

      const answerCandidatesSnapshot = await getDocs(answerCandidatesRef);
      answerCandidatesSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });

      const offerCandidatesSnapshot = await getDocs(offerCandidatesRef);
      offerCandidatesSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });


      await deleteDoc(roomRef);
    }

    window.location.reload() // redirect to start call page?
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

export default Videos