
// import { useParams } from "react-router-dom"

// import { useParams } from "react-router-dom"
import { useEffect, useState, useRef} from "react"
import { useSelector, useDispatch,  } from 'react-redux'
import { setAudioInputDeviceIds, setVideoInputDeviceIds, setSelectedAudioDeviceId, setSelectedVideoDeviceId } from '../store/slices/mediaDeviceSlice';
import  { toggleHasJoined, setHasJoinedFalse, setHasJoinedTrue } from '../store/slices/videoCallSlice';
import type { RootState } from '../store/index'

export default function CallSettings() {
  // const { callId } = useParams()
  // const callId = '645a205090d5f0e0b2b99689'
  const dispatch = useDispatch()

  const [ availableAudioDevices, setAvailableAudioDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ availableVideoDevices, setAvailableVideoDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ localMediaStream, setLocalMediaStream ] = useState<MediaStream | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(undefined!);
  const hasJoined = useSelector((state: RootState) => state.videoCall.hasJoined)
  const isHost = useSelector((state: RootState) => state.videoCall.isHost)
  const selectedAudioDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedAudioDeviceId)
  const selectedVideoDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedVideoDeviceId)

  useEffect(() => {
    const localSetup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: true });

        stream.getAudioTracks()[0].enabled = false;
        videoRef.current.srcObject = stream

        let devices = await navigator.mediaDevices.enumerateDevices();
        console.log({devices});
        let audioDevices = devices.filter((device) => device.kind === 'audioinput'); // seperate audio and video devices
        let videoDevices = devices.filter((device) => device.kind === 'videoinput');

        setAvailableAudioDevices(audioDevices); //populate useState array for html dropdown with devices
        setAvailableVideoDevices(videoDevices);

        const audioDeviceIds = audioDevices.map((device) => device.deviceId) // grab device ids
        const videoDeviceIds = videoDevices.map((device) => device.deviceId)

        dispatch(setAudioInputDeviceIds(audioDeviceIds)) // populate redux store with device ids
        dispatch(setVideoInputDeviceIds(videoDeviceIds))

        console.log({audioDeviceIds}); // log them for the joy of it
        console.log({videoDeviceIds});

        dispatch(setSelectedAudioDeviceId(audioDevices[0].deviceId)) // set the default device to the first one in the array
        dispatch(setSelectedVideoDeviceId(videoDevices[0].deviceId))
        setIsLoading(false) // disable loading state

      } catch (error) {
        console.error("An error occured during the media device setup", error)
      }
    }


    localSetup();


  },[]);

  useEffect(() => {
    dispatch(setHasJoinedFalse())
  }, [])



  const handleAudioDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = availableAudioDevices.find((device: MediaDeviceInfo) => device.deviceId  === event.target.value); // find the device that matches the id

    if(!device) return console.error("could not find that device") // if no device is found log an error

    const newStream = await navigator.mediaDevices.getUserMedia({ // get a new stream with the new device
      audio: { deviceId: { exact: device.deviceId } }
    })

    if(localMediaStream){ // if there is a stream already
      localMediaStream.removeTrack(localMediaStream.getAudioTracks()[0]); // remove the old track
      localMediaStream.addTrack(newStream.getAudioTracks()[0]) // add the new track
    } else {
      setLocalMediaStream(newStream) // if there is no stream set the new stream
    }
    dispatch(setSelectedAudioDeviceId(device.deviceId)) // set the selected device in the redux store
  };

  const handleVideoDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = availableVideoDevices.find((device: MediaDeviceInfo) => device.deviceId === event.target.value);

    if(!device) return console.error("could not find that device")

    const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: device.deviceId } }
    })

    if(localMediaStream){
      localMediaStream.removeTrack(localMediaStream.getVideoTracks()[0]);
      localMediaStream.addTrack(newStream.getVideoTracks()[0])
    } else {
      videoRef.current.srcObject = newStream
    }

    dispatch(setSelectedVideoDeviceId(device.deviceId))
  };

  return (

    <>
      <div>
        <div className={`${isHost ? "bg-green-300" : "bg-red-300"}`}>{isHost ? "Host" : "Not Host"}</div>
        <div className={`${isLoading ? "bg-red-300" : "bg-green-300"}`}>loading state for spinner</div>

        <div>
          <div className="text-white text-2xl">micid: {selectedAudioDeviceId}</div>
          <div className="text-white text-2xl">camid: {selectedVideoDeviceId}</div>
        </div>

        <div className={`${hasJoined ? "hidden" : null } flex items-center justify-around border rounded-md mb-2 h-[500px] w-[750px] `}>

          {/* <canvas className='w-5/12 h-auto rounded-md border' ref={canvasRef}/> */}

          <video
            className={ `w-5/12 h-auto rounded-md border-3 `}
            ref={videoRef}
            autoPlay
            muted
            playsInline></video>
        </div>

        <div className={`${hasJoined ? "hidden" : null }border border-zinc-400 rounded-lg flex justify-center `}>
          <div className={`${hasJoined ? "hidden" : null } flex m-2`}>
            <label className="border border-zinc-950 bg-zinc-300 rounded-full p-1 mr-2" htmlFor="audio">
              {/* <MicrophoneIcon className='w-6'/> */}
               Mic
              </label>
            <select
              className='w-48 rounded-md'
              id="audio"
              onChange={handleAudioDeviceChange}
              >

              {availableAudioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>

          <div className={`${hasJoined ? "hidden" : null } flex m-2`}>

          {/* <button className="border border-zinc-950 bg-zinc-300 rounded-md p-1 mr-2" onClick={toggleFlip}>Toggle Flip</button> */}

            <label className="border border-zinc-950 bg-zinc-300 rounded-full p-1 mr-2" htmlFor="video">
              {/* <VideoCameraIcon className='w-6'/> */}
              Cam
              </label>
            <select
              className='w-48 rounded-md'
              id="video"
              onChange={handleVideoDeviceChange}
              >

            {availableVideoDevices.map((device) => (

              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
            </select>
          </div>

            </div>
              <button onClick={() => dispatch(setHasJoinedTrue())}className={`${hasJoined ? "hidden" : null } w-24 bg-cyan-400 rounded-md`}>Join</button>
        </div>


          <div className={`${!hasJoined ? "hidden" : null } flex flex-col items-center justify-center h-screen`}>
            has joined the call
            <button
             className={`${!hasJoined ? "hidden" : null } bg-cyan-400 rounded-md w-24`}
              onClick={() => dispatch(setHasJoinedTrue())}>
              settings screen
              </button>
            </div>
          </>

      );
}

