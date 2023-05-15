import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef} from "react"
import { useSelector, useDispatch,  } from 'react-redux'
import { setSelectedAudioDeviceId, setSelectedVideoDeviceId } from '../mediaDeviceSlice';

import type { RootState } from '../store';
import { AiOutlineAudio, AiOutlineVideoCamera } from "react-icons/ai"

export default function GuestCallSettings() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {url} = useParams()
  const [ availableAudioDevices, setAvailableAudioDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ availableVideoDevices, setAvailableVideoDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ previewStream, setPreviewStream ] = useState<MediaStream | null>(null);
  const [ isLoading, setIsLoading ] = useState(true); //TODO use this for spinner while devices are being fetched
  const videoRef = useRef<HTMLVideoElement>(undefined!);

  const audioDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedAudioDeviceId);
  const videoDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedVideoDeviceId);

  useEffect(() => {
    const localSetup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {  channelCount: 1,
        sampleRate: 16000, }, video: true });
        videoRef.current.srcObject = stream

        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log({devices});
        const audioDevices = devices.filter((device) => device.kind === 'audioinput'); // seperate audio and video devices
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');

        setAvailableAudioDevices(audioDevices); //populate useState array for html dropdown with devices
        setAvailableVideoDevices(videoDevices);


        setIsLoading(false) // disable loading state

      } catch (error) {
        console.error("An error occured during the media device setup", error)
      }
    }

    localSetup();
  },[]);




  const handleAudioDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = availableAudioDevices.find((device: MediaDeviceInfo) => device.deviceId  === event.target.value); // find the device that matches the id
    console.log("new audio device id:", device?.deviceId);

    if(!device) return console.error("could not find that device") // if no device is found log an error

    const newStream = await navigator.mediaDevices.getUserMedia({ // get a new stream with the new device
      audio: { deviceId: { exact: device.deviceId } }
    })

    if(previewStream){ // if there is a stream already
      previewStream.removeTrack(previewStream.getAudioTracks()[0]); // remove the old track
      previewStream.addTrack(newStream.getAudioTracks()[0]) // add the new track
    } else {
      setPreviewStream(newStream) // if there is no stream set the new stream
    }
    dispatch(setSelectedAudioDeviceId(device.deviceId)) // set the selected device id in the store
  };

  const handleVideoDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = availableVideoDevices.find((device: MediaDeviceInfo) => device.deviceId === event.target.value);
    console.log("new video device id:", device?.deviceId);

    if(!device) return console.error("could not find that device")

    const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: device.deviceId } }
    })

    if(previewStream){
      previewStream.removeTrack(previewStream.getVideoTracks()[0]);
      previewStream.addTrack(newStream.getVideoTracks()[0])
    } else {
      videoRef.current.srcObject = newStream
    }

    dispatch(setSelectedVideoDeviceId(device.deviceId))
  };


  const handleJoinClick = () => {
    if(!audioDeviceId) {
      dispatch(setSelectedAudioDeviceId(availableAudioDevices[0].deviceId))
    }

    if(!videoDeviceId) {
      dispatch(setSelectedVideoDeviceId(availableVideoDevices[0].deviceId))
    }

    navigate(`/room/${url}`)
  };

  return (

<>
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col">
        <div className={`flex items-center justify-around rounded-md mb-2 h-[500px] w-[750px]`}>

          {/* <canvas className='w-5/12 h-auto rounded-md border' ref={canvasRef}/> */}

          <video
            className={ `${isLoading ? "animate-pulse bg-zinc-500" : null} w-screen h-5/6 rounded-md border-3 drop-shadow-lg `}
            ref={videoRef}
            autoPlay
            muted
            playsInline></video>
        </div>
        <div className={`border border-zinc-400 rounded-lg flex justify-center items-center`}>
          <div className={`flex m-2`}>
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

              {availableAudioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>

          <div className={`flex m-2 ml-20`}>

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

            {availableVideoDevices.map((device) => (

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
          <p className="text-lg mb-5">Sollicitudin tortor tempus</p>
          <button onClick={handleJoinClick}className={` w-32 h-12 bg-gray-500 text-white rounded-3xl`}>Join</button>
        </div>
    </div>



          </>

      );
}