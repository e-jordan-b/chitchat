import React, { useEffect, useState } from 'react';
import { useFetcher } from 'react-router-dom';

const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [error, setError] = useState<DOMException>();

  const request = async (audioDeviceId?: string, videoDeviceId?: string, onCompletion?: () => {}) => {
    try {
      const avStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          // deviceId: audioDeviceId
        },
        video: true

        //{ deviceId: videoDeviceId},
      });

      setStream(avStream);
    } catch (error) {
      setError(error as DOMException);
    }
  };

  // useEffect(() => {
  //   request();
  // }, []);

  return { stream, error, requestPermissions: request };
};

export default useMediaStream;
