import React, { useEffect, useRef, useState } from 'react';
import './room-precall.css';
import { AiFillAudio, AiFillVideoCamera } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const RoomPreCall: React.FC<{
  onJoin: () => void;
  mediaStream: MediaStream | undefined;
  inputSpeaker: (name: string) => void;
}> = ({ onJoin, mediaStream, inputSpeaker }) => {
  // Deal with audio stream and video stream
  // Maybe you dont need the audio stream

  console.log('here')

  const videoRef = useRef<HTMLVideoElement>(undefined!);
  const [ isLoading, setIsLoading ] = useState(true);

  const [name, setName] = useState('');
  const [inputFocus, setInputFocus] = useState(false);

  type FakeDevice = {
    deviceId: string;
    label: string;
  };

  const fakeAudioDevices: FakeDevice[] = [
    {
      deviceId: "1",
      label: "Logitech HD Pro Webcam C920",
    },
    {
      deviceId: "2",
      label: "Trust GXT 1160 Vero Streaming Webcam FullHD",
    },
  ]

    const fakeVideoDevices: FakeDevice[] = [
      {
        deviceId: "3",
        label: "Realtek High Definition Audio",
      }, {
        deviceId: "4",
        label: "Logitech PRO X Gaming Headset",
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

  useEffect(() => {
    if (mediaStream) videoRef.current.srcObject = mediaStream;
    console.log('useeffect')
  }, [mediaStream])

  const joiningRoom = (name: string) => {
    if (!name) return alert('You must enter a name');
    inputSpeaker(name);
    onJoin();
  }


  return (
  <section id="device-selection" className="h-full w-full flex justify-center items-center bg-white dark:bg-gray-800 ">
    <div className="flex flex-col lg:flex-row md:flex-row justify-center items-center h-full md:h-1/4 lg:h-3/5 mg:h-2/4 p-2 w-full  ">

      <div className="h-full md:w-2/4 lg:w-2/5">

        <div id="vide-and-controls" className='flex flex-col  lg:mt-10 items-center justify-startw-full h-full mg:w-full lg:w-full mg:h-3/4 lg:h-3/4 min-w-[300px] '>

          <div id="video-container" className="flex flex-col xs:ml-5 items-center justify-center  w-full h-full min-w-[300px] aspect-w-16 aspect-h-9 relative ">

          <video
            // className={`${isLoading ? "animate-pulse bg-custom-purple-600" : null} absolute top-0 left-0 w-full h-full object-cover rounded-xl border-3 drop-shadow-xl`}
            className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl border-3 drop-shadow-xl`}
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ scale: '-1 1 1' }}
            ></video>

          </div>

        </div>
        <div id="controls-container" className="bottom-5 mt-5 flex justify-center space-x-4">
        <div id="video-devices" className="flex items-center justify-center bg-white rounded-md xs:mr-1 lg:mr-5 md:mr-8 border-custom-purple-600 p-2">

        <AiFillVideoCamera size={20} className="mt-0.5 mr-1" />

        <select
          className="w-48 rounded-md"
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


        <div id="audio-devices" className="flex items-center justify-center bg-white rounded-md border-custom-purple-600 p-2">
        <AiFillAudio size={23} className="mt-0.5 mr-1 w-[25px]" />
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

    <section id="continue" className=" flex justify-center items-center mb-5 md:mx-28 w-full lg:w-1/4 mg:w-1/4 max-w-[500px] h-full">
      <div className="flex flex-col justify-center items-center rounded-lg drop-shadow-sm h-72 w-full md:w-5/6 lg:w-5/6 xl:w-5/6 2xl:w-5/6 bg-white">
        <h3 className="md:text-2xl text-4xl text-center font-semibold mb-4">What's your name?</h3>
        <input
          onChange={(e) => setName(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          placeholder='Enter your name...'
        className={` mb-10 h-14 w-4/6 border-b-4 min-w-[75px] rounded-t-md transition-all bg-custom-purple-50 px-5 ${inputFocus ? "border-custom-purple-900" : "border-gray-200"}`} type="text" name="" id="" />
        {/* <button
          onClick={}
          className="px-2 py-2 border rounded-md bg-custom-purple-400 text-white absolute bottom-8 right-8 w-24"
          >Join Room
        </button> */}

        <button
          onClick={() => joiningRoom(name)}
          className="px-2 whitespace-nowrap h-14 w-4/6 min-w-[75px] bg-custom-purple-400 transition-all rounded-md text-custom-purple-50 sm:text-xl mb-2 md:text-base md:w-/12 lg:text-xl  hover:bg-custom-purple-900">
          Join Room</button>
      </div>
    </section>

  </div>
</section>)

};

export default RoomPreCall;
