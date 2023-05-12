import React, { useEffect, useState } from 'react';
import { useFetcher } from 'react-router-dom';

const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [error, setError] = useState<DOMException>();

  const request = async () => {
    try {
      const avStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 16000 },
        video: true,
      });

      setStream(avStream);
    } catch (error) {
      setError(error as DOMException);
    }
  };

  useEffect(() => {
    request();
  }, []);

  return { stream, error };
};

export default useMediaStream;
