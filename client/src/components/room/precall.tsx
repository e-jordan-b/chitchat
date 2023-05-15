// import { useParams } from "react-router-dom"
import { useEffect, useState, useRef} from "react"
import { AiOutlineAudio, AiOutlineVideoCamera } from "react-icons/ai"
import {
  updateAudioDeviceId,
  updateVideoDeviceId,
} from '../../mediaDeviceSlice';
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store'


export default function CallSettings({onJoin}: {onJoin: () => void}) {
  const dispatch = useDispatch();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [ isLoading, setIsLoading ] = useState(true);
  const [ previewStream, setPreviewStream ] = useState<MediaStream | null>(null);

  const [ selectedAudioDevice, setSelectedAudioDevice] = useState<MediaDeviceInfo | null>(null);
  const [ selectedVideoDevice, setSelectedVideoDevice] = useState<MediaDeviceInfo | null>(null);

  const [ availableVideoDevices, setAvailableVideoDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ availableAudioDevices, setAvailableAudioDevices ] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const previewSetup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
          channelCount: 1,
          sampleRate: 16000,
        }, video: true
      });

        videoRef.current!.srcObject = stream
        setPreviewStream(stream)

        const devices = await navigator.mediaDevices.enumerateDevices();

        console.log({devices});

        setAvailableAudioDevices(devices.filter((device) => device.kind === 'audioinput'));
        setAvailableVideoDevices(devices.filter((device) => device.kind === 'videoinput'));

        setIsLoading(false)

      } catch (error) {
        console.error("An error occured during the media device setup", error)
      }
    }

    previewSetup();

  },[]);

  const handleAudioDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = availableAudioDevices.find((device: MediaDeviceInfo) => device.deviceId  === event.target.value); // find the device that matches the id
    console.log("new audio device id:", device?.deviceId);

    if(!device) return console.error("could not find that device") // if no device is found log an error or toast

    const newPreviewStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: device.deviceId},
      video: { deviceId: selectedVideoDevice?.deviceId}
    }
      )

    if(previewStream){ // if there is a stream already
      previewStream.removeTrack(previewStream.getAudioTracks()[0]); // remove the old track
      previewStream.addTrack(newPreviewStream.getAudioTracks()[0]) // add the new track
    } else {
      setPreviewStream(newPreviewStream) // if there is no stream set the new stream
    }

    setSelectedAudioDevice(device)
    dispatch(updateAudioDeviceId(device.deviceId))

  };

  const handleVideoDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = availableVideoDevices.find((device: MediaDeviceInfo) => device.deviceId === event.target.value);
    console.log("new video device id:", device?.deviceId);

    if(!device) return console.error("could not find that device")

    const newPreviewStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: selectedAudioDevice?.deviceId },
      video: { deviceId: device.deviceId }

    })

    if(previewStream){
      previewStream.removeTrack(previewStream.getVideoTracks()[0]);
      previewStream.addTrack(newPreviewStream.getVideoTracks()[0])
    } else {
      videoRef.current!.srcObject = newPreviewStream
    }

    setSelectedVideoDevice(device);
    dispatch(updateVideoDeviceId(device.deviceId))

  };

  return (

<>
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col">
        <div className={` flex items-center justify-around rounded-md mb-2 h-[500px] w-[750px]`}>

          {/* <canvas className='w-5/12 h-auto rounded-md border' ref={canvasRef}/> */}

          <video
            className={ `${isLoading ? "animate-pulse bg-cyan-700" : null} w-screen h-5/6 rounded-md border-3 drop-shadow-lg `}
            ref={videoRef}
            autoPlay
muted
            playsInline></video>
        </div>
        <div className={`border border-zinc-400 rounded-lg flex justify-center items-center`}>
          <div className={` flex m-2`}>
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

          <div className={` flex m-2 ml-20`}>

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
          <p className="text-lg mb-5">Sollicitudin tortor tempus,
</p>
          <button className={` w-32 h-12 bg-gray-500 text-white rounded-3xl`}>Join</button>
        </div>
    </div>


          <div className={` flex flex-col items-center justify-center h-screen`}>
            has joined the call
            <button
             className={` bg-cyan-400 rounded-md w-24`}
             >
              settings screen
              </button>
            </div>
          </>

      );
}

