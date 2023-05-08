import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { blob } from 'stream/consumers';

console.log('a')

function App() {
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const audioSet = useRef<number>(0);

  useEffect(() => {
    console.log('Enumerating streams');
    const micId =
      'd8fec6ff172c0b093383e837bb515845a0b3d0f2a3e1c675f1dbc0b36e0ac6ad';

    const fire = async () => {
      // const devices = await enumerateDevices();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: micId },
      });

      // const audioContext = new AudioContext();
      // const analyser = audioContext.createAnalyser();
      // const microphone = audioContext.createMediaStreamSource(stream);
      // const scriptProcessor = audioContext.createSccre

      const recorderChunks: Blob[] = [];
      const options = {
        audioBitsPerSecond: 128000,

        mimeType: 'audio/webm',
      };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.ondataavailable = (blobEvent: BlobEvent) => {
        if (blobEvent.data && blobEvent.data.size > 0) {
          recorderChunks.push(blobEvent.data);
        }
      };
      mediaRecorder.onstart = () => {
        console.log('Started recording');
      };
      mediaRecorder.onstop = () => {
        //
      };
      mediaRecorder.start(1000);

      setInterval(() => {
        console.log('Pushin AUDIO');
        console.log(audioSet.current);
        console.log(recorderChunks.length);
        // If you splice you remove the metadata and can't form the second url correctly
        // const data = recorderChunks.splice(0, recorderChunks.length);
        const blob = new Blob(recorderChunks, { type: 'audio/webm' });

        const asyncBlob = async (blob: Blob) => {
          const buffer = await blob.text();
          console.log(buffer.toString());
        };

        // asyncBlob(blob);

        const buffer = blob.text.toString();
        console.log(buffer);
        const audioURL = window.URL.createObjectURL(blob);

        console.log(audioURL);

        if (audioSet.current === 0 && audioRef1.current) {
          console.log('IN 1');
          audioRef1.current.src = audioURL;
        }

        if (audioSet.current === 1 && audioRef2.current) {
          console.log('IN 2');
          audioRef2.current.src = audioURL;
        }

        audioSet.current++;
      }, 5000);

      // setTimeout(() => {
      //   mediaRecorder.stop();
      // }, 10000);
    };

    enumerateDevices();
    fire();
  }, []);

  const enumerateDevices = async (): Promise<MediaDeviceInfo[]> => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('-----');
    devices.forEach((device) => {
      console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
    });
    return devices;
  };

  return (
    <div className="App">
      <audio ref={audioRef1} controls={true} />
      <audio ref={audioRef2} controls={true} />
    </div>
  );
}

export default App;
