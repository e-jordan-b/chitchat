import { ITranscript } from '../models/transcription-model';

const roomsMap: Map<string, ITranscript[]> = new Map();

export const addToMemory = (transcript: ITranscript): boolean => {
  if (roomsMap.has(transcript.room)) {
    roomsMap.get(transcript.room)!.push(transcript);
  } else {
    roomsMap.set(transcript.room, [transcript]);
  }

  return true;
};

export const getFromMemoryByRoom = (
  roomId: string
): ITranscript[] | undefined => {
  return roomsMap.get(roomId);
};

export const clearFromMemoryByRoom = (roomId: string) => {
  if (roomsMap.has(roomId)) {
    roomsMap.delete(roomId);
    return true;
  } else {
    return false;
  }
};
