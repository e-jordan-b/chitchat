import mongoose, { MongooseError, ObjectId } from 'mongoose';
import { IRoom, Room } from './room-model';
import { User } from './user-model';

export interface ISummary {
  _id?: ObjectId | string;
  timestamp: number;
  text: string;
}

const SummarySchema = new mongoose.Schema<ISummary>({
  timestamp: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

export const Summary = mongoose.model<ISummary>('Summary', SummarySchema);

export const createSummary = async (
  data: ISummary
): Promise<{ summary?: ISummary; error?: MongooseError }> => {
  try {
    const summary = await Summary.create(data);
    return { summary };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};

export const editSummaryById = async (
  summaryId: string,
  text: string
): Promise<{ summary?: ISummary; error?: MongooseError }> => {
  try {
    const summary = await Summary.findByIdAndUpdate(
      summaryId,
      {
        text,
      },
      { new: true }
    ).orFail();
    return { summary };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};

export const updateRoomWithCallSummary = async (
  roomUrl: string,
  summaryText: string
): Promise<{ success: boolean; error?: MongooseError }> => {
  try {
    await Room.findOneAndUpdate({urlUUID: roomUrl}, {
      $set: { callSummary: summaryText }
    }).orFail();
    return { success: true };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { success: false, error: mongooseError };
  }
};

interface IUserRoom {
  roomId: ObjectId;
  roomName: string;
  createdAt?: number;
  urlUUID: string;
  callSummary?: string;
  agenda?: string[];
}

export const fetchUserSummaries = async (
  userId: string,
): Promise<{ rooms?: IUserRoom[]; error?: MongooseError }> => {

  try {
    const user = await User.findById(userId).populate('createdRooms').orFail();

    const rooms: IUserRoom[] = user.createdRooms.map((room: any) => ({
      roomId: room._id,
      roomName: room.roomName,
      createdAt: room.createdAt,
      urlUUID: room.urlUUID,
      callSummary: room.callSummary,
      agenda: room.agenda,
    }));

    //console.log('rooms ---> ', rooms);
    return { rooms };

  } catch (error) {
    console.error(error);
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
}
