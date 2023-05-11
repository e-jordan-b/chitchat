import React, { useRef, useState } from 'react';
import './App.css';

export default function App() {
  const [socket, _] = useState<WebSocket>(
    new WebSocket('ws://localhost:3002/')
  );
  const audioRef1 = useRef<HTMLAudioElement>(null);

  socket.onopen = () => {
    setupStreaming(socket);

    socket.send(JSON.stringify({ callStarted: true }));
  };

  /**
   * Setups up the streaming for whatever
   * @param socket
   */
  const setupStreaming = async (socket: WebSocket) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, sampleRate: 16000 },
    });

    const recorderChunks: Blob[] = [];
    const options: MediaRecorderOptions = {
      mimeType: 'audio/webm; codecs=opus',
    };

    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        recorderChunks.push(event.data);
        socket.send(event.data);
      }
    };
    mediaRecorder.onstart = () => {
      console.log('Started recording');
    };
    mediaRecorder.start(1000);

    setTimeout(() => {
      const audio = new Blob(recorderChunks, { type: 'audio/webm' });
      const audioURL = window.URL.createObjectURL(audio);
      audioRef1.current!.src = audioURL;
    }, 5000);
  };

  return (
    <div className="App">
      <audio ref={audioRef1} controls={true} />
      {/* <audio ref={audioRef2} controls={true} /> */}
    </div>
  );
}
