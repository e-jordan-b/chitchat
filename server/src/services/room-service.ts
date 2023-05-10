const states: Map<string, RoomState> = new Map();

interface RoomState {
  id: string;
  url: string;
  callStatus: CallState;
  callers: string[];
}

enum CallState {
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
}

/**
 * Safely creates a new room.
 * The room can be used to keep track of the call status.
 * @param id
 * @param url
 * @returns
 */
export const safelyCreateRoom = (id: string, url: string) => {
  if (states.has(id)) return;

  states.set(id, { id, url, callStatus: CallState.PAUSED, callers: [] });
};

/**
 * Adds a caller to the room.
 * @param roomId
 * @param callerId
 * @returns
 */
export const addCallerToRoom = (roomId: string, callerId: string): boolean => {
  if (states.has(roomId)) {
    states.get(roomId)!.callers.push(callerId);
    return true;
  } else {
    return false;
  }
};

/**
 * Removes a caller from the room
 * @param roomId
 * @param callerId
 * @returns
 */
export const removeCallerFromRoom = (
  roomId: string,
  callerId: string
): boolean => {
  if (states.has(roomId)) {
    states.get(roomId)!.callers = states
      .get(roomId)!
      .callers.filter((caller) => caller !== callerId);
    return true;
  } else {
    return false;
  }
};

/**
 * Updates the room call status.
 * @param roomId
 * @param callStatus
 * @returns
 */
export const updateRoomCallStatus = (
  roomId: string,
  callStatus: CallState
): boolean => {
  if (states.has(roomId)) {
    states.get(roomId)!.callStatus = callStatus;
    return true;
  } else {
    return false;
  }
};
