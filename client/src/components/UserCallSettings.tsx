import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef} from "react"
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedAudioDeviceId, setSelectedVideoDeviceId } from '../mediaDeviceSlice';

import type { RootState } from '../store';

import { AiOutlineAudio, AiFillAudio, AiFillPhone,
   AiOutlineVideoCamera, AiFillVideoCamera } from "react-icons/ai"

export default function UserCallSettings() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [ availableAudioDevices, setAvailableAudioDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ availableVideoDevices, setAvailableVideoDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ previewStream, setPreviewStream ] = useState<MediaStream | null>(null);
  const [ isLoading, setIsLoading ] = useState(true); //TODO use this for spinner while devices are being fetched
  const videoRef = useRef<HTMLVideoElement>(undefined!);
  const [inputFocus, setInputFocus] = useState(false);
  const audioDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedAudioDeviceId);
  const videoDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedVideoDeviceId);

  useEffect(() => {
    const localSetup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: true });
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


  const goToAgenda = () => {
    if(!audioDeviceId) {
      dispatch(setSelectedAudioDeviceId(availableAudioDevices[0].deviceId))
    }

    if(!videoDeviceId) {
      dispatch(setSelectedVideoDeviceId(availableVideoDevices[0].deviceId))
    }

    navigate("/agenda")
  };

  const handleFocus = () => setInputFocus(true)
  const handleBlur = () => setInputFocus(false)
  const handleMouseEnter = () => setInputFocus(true)
  const handleMouseLeave = () => setInputFocus(false)



  return (
<section id="device-selection" className="h-full w-full flex justify-center items-center ">
  <div className="flex flex-col lg:flex-row md:flex-row justify-center items-center h-full md:h-1/4 lg:h-2/4 mg:h-2/4 p-2 w-full  ">

<div className="h-full md:w-2/4 lg:w-1/3 ">


<div id="vide-and-controls" className='flex flex-col  lg:mt-10 items-center justify-startw-full h-full mg:w-full lg:w-full mg:h-3/4 lg:h-3/4 min-w-[300px] '>

    <div id="video-container" className="flex flex-col xs:ml-5 items-center justify-center  w-full h-full min-w-[300px] aspect-w-16 aspect-h-9 relative ">

      <video
        className={`${isLoading ? "animate-pulse bg-custom-purple-600" : null} absolute top-0 left-0 w-full h-full object-cover rounded-xl border-3 drop-shadow-xl`}
        ref={videoRef}
        autoPlay
        muted
        playsInline
        ></video>


    </div>


        </div>
        <div id="controls-container" className="bottom-5 mt-5 flex justify-center space-x-4">

<div id="video-devices" className="flex  items-center justify-center bg-white rounded-full border xs:mr-1 lg:mr-5 md:mr-8 border-custom-purple-600 p-2">
  <AiFillVideoCamera size={25} className="mt-0.5 mr-1" />
  <select
    className="w-48 rounded-md border"
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

<div id="audio-devices" className="flex items-center justify-center bg-white rounded-full border border-custom-purple-600 p-2">
  <AiFillAudio size={25} className="mt-0.5 mr-1 w-[25px]" />
  <select
    className="w-48 rounded-md h-7"
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
</div>
        </div>

    <section id="continue" className="flex justify-center items-center mb-5 md:mx-28 w-full lg:w-1/4 mg:w-1/4 max-w-[500px] h-full">
      <div className="flex flex-col justify-center items-center rounded-lg drop-shadow-xl h-72 w-full lg:w-3/4 md:w-3/4 animate-skeleton bg-custom-purple-300">
        <h3 className="md:text-2xl text-4xl text-center font-semibold mb-10">What's your name?</h3>
        <input
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        className={`mb-10 h-14 w-4/6 border-b-4 min-w-[75px] rounded-t-md transition-all bg-custom-purple-50 px-5 ${inputFocus ? "border-custom-purple-900" : "border-gray-200"}`} type="text" name="" id="" />
        <button
          onClick={goToAgenda}
          className="px-2 whitespace-nowrap h-14 w-4/6 min-w-[75px] bg-custom-purple-700 transition-all rounded-md text-custom-purple-50 sm:text-xl mb-2 md:text-base md:w-10/12 lg:text-xl  hover:bg-custom-purple-900">Create Agenda</button>
      </div>
    </section>

  </div>
</section>


      );
}


