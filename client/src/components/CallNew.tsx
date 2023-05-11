
import { useParams } from "react-router-dom"
import { useEffect, useState, useRef} from "react"


export default function  CallNew() {
  const [hasJoined, setHasJoined] = useState(true)

  // const { callId } = useParams()
  //
// return (null)
  // const callId = '645a205090d5f0e0b2b99689'
  const [ audioDevices, setAudioDevices ] = useState<MediaDeviceInfo[]>([]);
  const [ videoDevices, setVideoDevices ] = useState<MediaDeviceInfo[]>([]);

  // move to store
  const [ selectedAudioDevice, setSelectedAudioDevice ] = useState<MediaDeviceInfo | null>(null);
  const [ selectedVideoDevice, setSelectedVideoDevice ] = useState<MediaDeviceInfo | null>(null);
  const [ localMediaStream, setLocalMediaStream ] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(undefined!);

  const [ outgoingMediaStream, setOutgoingMediaStream ] = useState<MediaStream | null>(null);

  useEffect(() => {
    const localSetup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: true });
        const clonedStream = stream.clone();
        // clonedStream.getAudioTracks()[0].enabled = false;
        setLocalMediaStream(clonedStream)
        setOutgoingMediaStream(stream)
        videoRef.current.srcObject = clonedStream

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter((device) => device.kind === 'audioinput');
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');

        //store in store
        setAudioDevices(audioDevices);
        setVideoDevices(videoDevices);

        // get from store

        setSelectedAudioDevice(audioDevices[0]);
        setSelectedVideoDevice(videoDevices[0]);

      } catch (error) {
        console.error("An error occured during the media device setup", error)
      }
  }
    localSetup();
  },[]);

  const handleAudioDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = audioDevices.find((device) => device.deviceId  === event.target.value) as MediaDeviceInfo;
    console.log(device);
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: device.deviceId } }
    })

    console.log(newStream.getTracks());

    if(localMediaStream){

      localMediaStream.removeTrack(localMediaStream.getAudioTracks()[0]);
      localMediaStream.addTrack(newStream.getAudioTracks()[0])
    } else {
      setLocalMediaStream(newStream)
    }

    // dispatch to store
    setSelectedAudioDevice(device);
  };

  const handleVideoDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = videoDevices.find((device) => device.deviceId === event.target.value) as MediaDeviceInfo;
    const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: device.deviceId } }
    })

    console.log(newStream.getTracks());

    if(localMediaStream){
      localMediaStream.removeTrack(localMediaStream.getVideoTracks()[0]);
      localMediaStream.addTrack(newStream.getVideoTracks()[0])
    } else {
      setLocalMediaStream(newStream)
    }
  // dispatch to store
    setSelectedVideoDevice(device);
  };




  return (

<>
    <div>
        <div className={`${!hasJoined ? "hidden" : null } flex items-center justify-around border rounded-md mb-2 h-[500px] w-[750px] `}>

          {/* <canvas className='w-5/12 h-auto rounded-md border' ref={canvasRef}/> */}

          <video
            className={ `w-5/12 h-auto rounded-md border-3 `}
            ref={videoRef}
            autoPlay
            muted
            playsInline></video>
        </div>

        <div className={`${!hasJoined ? "hidden" : null }border border-zinc-400 rounded-lg flex justify-center `}>
          <div className={`${!hasJoined ? "hidden" : null } flex m-2`}>
            <label className="border border-zinc-950 bg-zinc-300 rounded-full p-1 mr-2" htmlFor="audio">
              {/* <MicrophoneIcon className='w-6'/> */}
               Mic
              </label>
            <select
              className='w-48 rounded-md'
              id="audio"
              onChange={handleAudioDeviceChange}
              >

              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>

          <div className={`${!hasJoined ? "hidden" : null } flex m-2`}>

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

            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
            </select>
          </div>

            </div>
              <button onClick={() => setHasJoined(!hasJoined)}className={`${!hasJoined ? "hidden" : null } w-24 bg-cyan-400 rounded-md`}>Join</button>
        </div>


          <div className={`${hasJoined ? "hidden" : null } flex flex-col items-center justify-center h-screen`}>
            has joined the call
            <button
             className={`${hasJoined ? "hidden" : null } bg-cyan-400 rounded-md w-24`}
              onClick={() => setHasJoined(!hasJoined)}>
              settings screen
              </button>
            </div>
          </>

      );
}

