import React, {useEffect} from 'react'

const AppStreamCam = () => {

  const streamCamVideo = () => {
  var constraints = { audio: true, video: { width: 1280, height: 720 } };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(mediaStream) {
      let video = document.querySelector("video") as HTMLVideoElement;

      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.
  }

  // useEffect(()=>{
  //   streamCamVideo()
  // },[])

  return (
    <div>
        <video autoPlay={true} id="videoElement" playsInline></video>
        <button id="webcamButton" onClick={streamCamVideo}>Start webcam</button>
    </div>
  );
}

export default AppStreamCam