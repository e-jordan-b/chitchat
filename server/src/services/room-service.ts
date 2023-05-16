interface IRoomState {
  roomId: string;
  participants: { id: string; speaker: string }[];
  status: IRoomStatus;
}

enum IRoomStatus {
  STARTED,
  PAUSED,
}

class RoomService {
  private roomsMap: Map<string, IRoomState>;

  constructor() {
    this.roomsMap = new Map();
  }

  /**
   * Safely adds a new room.
   * The room can be used to keep track of the call status.
   * @param id
   * @returns
   */
  addRoom(id: string): string {
    if (this.roomsMap.has(id)) return id;

    const roomState: IRoomState = {
      roomId: id,
      participants: [],
      status: IRoomStatus.PAUSED,
    };

    this.roomsMap.set(id, roomState);
    return id;
  }

  /**
   * Safely deletes a room.
   * The room gets deleted ONLY if no more callers are present in the room.
   * @param id
   * @returns
   */
  private removeRoom(id: string): boolean {
    if (!this.roomsMap.has(id)) return false;
    if (this.roomsMap.get(id)!.participants.length > 0) return false;

    return this.roomsMap.delete(id);
  }

  /**
   * Adds a caller to the room.
   * @param roomId
   * @param participantId
   * @returns
   */
  addCallerToRoom(
    roomId: string,
    participantId: string,
    speaker: string
  ): boolean {
    if (!this.roomsMap.has(roomId)) return false;

    this.roomsMap
      .get(roomId)!
      .participants.push({ id: participantId, speaker });
    return true;
  }

  getCallersForRoom(roomId: string): { id: string; speaker: string }[] {
    if (!this.roomsMap.has(roomId)) return [];

    return this.roomsMap.get(roomId)!.participants;
  }

  /**
   * Removes a caller from the room.
   * @param roomId
   * @param participantId
   * @returns
   */
  removeCallerFromRoom(roomId: string, participantId: string): boolean {
    if (!this.roomsMap.has(roomId)) return false;

    this.roomsMap.get(roomId)!.participants = this.roomsMap
      .get(roomId)!
      .participants.filter((participant) => participant.id !== participantId);
    return true;
  }

  /**
   * Checks if the room has more than one participant
   * @param roomId
   * @returns
   */
  shouldResumeStream(roomId: string): boolean {
    if (!this.roomsMap.has(roomId)) return false;

    return this.roomsMap.get(roomId)!.participants.length > 1;
  }

  shouldPauseStream(roomId: string): boolean {
    if (!this.roomsMap.has(roomId)) return true;

    return this.roomsMap.get(roomId)!.participants.length < 2;
  }
}

export default RoomService;
