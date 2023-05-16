import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef} from "react"
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedAudioDeviceId, setSelectedVideoDeviceId } from '../../mediaDeviceSlice';
import useMediaStream from '../../hooks/use-media-stream';
import type { RootState } from '../../store';
import { AiFillAudio , AiFillVideoCamera } from "react-icons/ai"

const RoomPreCall = ({onJoin}: {onJoin: () => void}) => {
  const navigate = useNavigate()
  const { stream, error, requestPermissions } = useMediaStream();
  // Maybe you dont need the audio stream
  // Deal with audio stream and video stream

  // cant use the useMediaStream hook here because it will reset the stream when the device is changed
  // see this commmit for refrence - working example of room without precall without interfering with the media stream
  // https://github.com/fredgrd/chitchat/commit/1a045317caa393d48c11c751c823f90dc013dbfe#diff-fa2e29a20049df58f4f55bd132796bd6afa8e0554a9a5b87f8254735b751449b

  const videoRef = useRef<HTMLVideoElement>(undefined!);
  const [ isLoading, setIsLoading ] = useState(true);

  const [name, setName] = useState('');
  const [inputFocus, setInputFocus] = useState(false);

  // const [ availableAudioDevices, setAvailableAudioDevices ] = useState<MediaDeviceInfo[]>([]);
  // const [ availableVideoDevices, setAvailableVideoDevices ] = useState<MediaDeviceInfo[]>([]);
  type FakeDevice = {
    deviceId: string;
    label: string;
  };

  const fakeAudioDevices: FakeDevice[] = [
    {
      deviceId: "1",
      label: "Fake Audio Device 1",
    },
    {
      deviceId: "2",
      label: "Fake Audio Device 2",
    },
  ]

    const fakeVideoDevices: FakeDevice[] = [
      {
        deviceId: "3",
        label: "Fake Video Device 1",
      }, {
        deviceId: "4",
        label: "Fake Video Device 2",
      },
    ]


  const [ availableVideoDevices, setAvailableVideoDevices ] = useState<FakeDevice[]>(fakeAudioDevices);
  const [ availableAudioDevices, setAvailableAudioDevices ] = useState<FakeDevice[]>(fakeVideoDevices);

  const handleFocus = () => setInputFocus(true)
  const handleBlur = () => setInputFocus(false)
  const handleMouseEnter = () => setInputFocus(true)
  const handleMouseLeave = () => setInputFocus(false)


  const handleAudioDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("audio device changed");
  };

  const handleVideoDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("video device changed");
  };


  const goToAgenda = () => {

    // if(!audioDeviceId) {
    //   dispatch(setSelectedAudioDeviceId(availableAudioDevices[0].deviceId))
    // }

    // if(!videoDeviceId) {
    //   dispatch(setSelectedVideoDeviceId(availableVideoDevices[0].deviceId))
    // }

    navigate("/agenda")
  };




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
      <div className="flex flex-col justify-center items-center rounded-lg drop-shadow-xl h-72 w-full lg:w-3/4 md:w-3/4 bg-custom-purple-300">
        <h3 className="md:text-2xl text-4xl text-center font-semibold mb-10">What's your name?</h3>
        <input
          onChange={(e) => setName(e.target.value)}
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

};

export default RoomPreCall;
