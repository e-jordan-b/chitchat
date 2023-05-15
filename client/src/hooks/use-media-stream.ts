import React, { useEffect, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [error, setError] = useState<DOMException>();

  const audioDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedAudioDeviceId);
  const videoDeviceId = useSelector((state: RootState) => state.mediaDevices.selectedAudioDeviceId);

  const request = async (onCompletion?: () => {}) => {
    try {
      const avStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          deviceId: audioDeviceId
        },
        video: {
          deviceId: videoDeviceId
        }

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
