
import { useParams } from "react-router-dom"
import { useEffect, useState, useRef} from "react"
import { useSelector, useDispatch,  } from 'react-redux'
import { setAudioInputDevices, setVideoInputDevices, setSelectedAudioDevice, setSelectedVideoDevice } from '../store/slices/mediaDeviceSlice';
import  { toggleHasJoined } from '../store/slices/videoCallSlice';
import type { RootState } from '../store/index'
import { AiOutlineAudio, AiOutlineVideoCamera } from "react-icons/ai"

export default function  CallNew() {
  const { callId } = useParams()
  // const callId = '645a205090d5f0e0b2b99689'
  const dispatch = useDispatch()

  const [ localMediaStream, setLocalMediaStream ] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(undefined!);

  let hasJoined = useSelector( (state: RootState) => state.videoCall.hasJoined)
  // alert(hasJoined)
  let audioInputDevices: MediaDeviceInfo[] = useSelector((state: RootState) => state.mediaDevices.audioInputDevices)
  let videoInputDevices: MediaDeviceInfo[] = useSelector((state: RootState) => state.mediaDevices.videoInputDevices)
  let selectedAudioDevice: MediaDeviceInfo | null = useSelector((state: RootState) => state.mediaDevices.selectedAudioDevice)
  let selectedVideoDevice: MediaDeviceInfo | null = useSelector((state: RootState) => state.mediaDevices.selectedVideoDevice)

  useEffect(() => {
    const localSetup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: true });

        // muted stream for cam preview
        stream.getAudioTracks()[0].enabled = false;
        videoRef.current.srcObject = stream

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter((device) => device.kind === 'audioinput');
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');

        console.log("before", selectedAudioDevice)
        console.log(selectedVideoDevice)



        dispatch(setAudioInputDevices(audioDevices))
        console.log("Mimi");
        dispatch(setVideoInputDevices(videoDevices))
        dispatch(setSelectedAudioDevice(audioDevices[0]))
        dispatch(setSelectedVideoDevice(videoDevices[0]))

        console.log("after dispatch", selectedAudioDevice)
        console.log(selectedVideoDevice)

      } catch (error) {
        console.error("An error occured during the media device setup", error)
      }
  }
    localSetup();
  },[]);

  const handleAudioDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = audioInputDevices.find((device: MediaDeviceInfo) => device.deviceId  === event.target.value);
    if(!device) return console.error("could not find that device")
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: device.deviceId } }
    })

    if(localMediaStream){
      localMediaStream.removeTrack(localMediaStream.getAudioTracks()[0]);
      localMediaStream.addTrack(newStream.getAudioTracks()[0])
    } else {
      setLocalMediaStream(newStream)
    }

    dispatch(setSelectedAudioDevice(device))

  };

  const handleVideoDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {

    console.log(selectedAudioDevice);
    const device = videoInputDevices.find((device: MediaDeviceInfo) => device.deviceId === event.target.value);
;
    if(!device) return console.error("could not find that device")
    const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: device.deviceId } }
    })

    console.log(newStream.getTracks());

    if(localMediaStream){
      localMediaStream.removeTrack(localMediaStream.getVideoTracks()[0]);
      localMediaStream.addTrack(newStream.getVideoTracks()[0])
    } else {
      videoRef.current.srcObject = newStream
    }

    dispatch(setSelectedVideoDevice(device))
    console.log(selectedAudioDevice);
  };




  return (

<>
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col">
        <div className={`${hasJoined ? "hidden" : null } flex items-center justify-around rounded-md mb-2 h-[500px] w-[750px]`}>

          {/* <canvas className='w-5/12 h-auto rounded-md border' ref={canvasRef}/> */}

          <video
            className={ `w-screen h-5/6 rounded-md border-3 `}
            ref={videoRef}
            autoPlay
            muted
            playsInline></video>
        </div>
        <div className={`${hasJoined ? "hidden" : null }border border-zinc-400 rounded-lg flex justify-center items-center`}>
          <div className={`${hasJoined ? "hidden" : null } flex m-2`}>
            {/* <label className="bg-gray-500 flex justify-center items-center w-12 h-8 text-white rounded-2xl" htmlFor="audio"> */}
            <AiOutlineAudio size={'20'}/>
              {/* <MicrophoneIcon className='w-6'/> */}
               {/* Mic */}
              {/* </label> */}
            <select
              className='w-48 rounded-md'
              id="audio"
              onChange={handleAudioDeviceChange}
              >

              {audioInputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>

          <div className={`${hasJoined ? "hidden" : null } flex m-2 ml-20`}>

          {/* <button className="border border-zinc-950 bg-zinc-300 rounded-md p-1 mr-2" onClick={toggleFlip}>Toggle Flip</button> */}

            {/* <label className="bg-gray-500 flex justify-center items-center w-12 h-8 text-white rounded-2xl" htmlFor="video"> */}
              {/* <VideoCameraIcon className='w-6'/> */}
              {/* Cam */}
              {/* </label> */}
              <AiOutlineVideoCamera size={20} className="mt-0.5 mr-1"/>
            <select
              className='w-48 rounded-md'
              id="video"
              onChange={handleVideoDeviceChange}
              >

            {videoInputDevices.map((device) => (

              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
            </select>
          </div>
          </div>
            </div>
        <div className="flex flex-col justify-center items-center w-1/3">
          <h1 className="text-6xl mb-7">Lorem Ipsum</h1>
          <p className="text-lg mb-5">Sollicitudin tortor tempus,
</p>
          <button onClick={() => dispatch(toggleHasJoined())}className={`${hasJoined ? "hidden" : null } w-32 h-12 bg-gray-500 text-white rounded-3xl`}>Join</button>
        </div>
    </div>


          <div className={`${!hasJoined ? "hidden" : null } flex flex-col items-center justify-center h-screen`}>
            has joined the call
            <button
             className={`${!hasJoined ? "hidden" : null } bg-cyan-400 rounded-md w-24`}
              onClick={() => dispatch(toggleHasJoined())}>
              settings screen
              </button>
            </div>
          </>

      );
}

