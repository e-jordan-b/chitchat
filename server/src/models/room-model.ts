import mongoose, { MongooseError, ObjectId } from 'mongoose';

export interface IRoom {
  _id: ObjectId | string;
  createdAt: number;
  endedAt: number;
  participants: string[] | ObjectId[];
  transcriptions: string[] | ObjectId[];
  summaries: ObjectId[] | string[];
  callSummary: ObjectId | string;
  agenda: string[];
}

const RoomSchema = new mongoose.Schema<IRoom>({
  createdAt: {
    type: Number,
  },
  endedAt: {
    type: Number,
  },
  participants: {
    type: [String],
    default: [],
  },
  transcriptions: {
    type: [String],
    default: [],
  },
  summaries: {
    type: [String],
    default: [],
  },
  callSummary: {
    type: String,
    default: [],
  },
  agenda: {
    type: [String],
    default: [],
  },
});

export const Room = mongoose.model<IRoom>('Room', RoomSchema);

// [ START Helpers]
export const createOneRoom = async (
  data: IRoom
): Promise<{ room?: IRoom; error?: MongooseError }> => {
  try {
    const room = await Room.create(data);
    return { room };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};
