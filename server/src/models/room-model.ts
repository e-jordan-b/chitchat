import mongoose, { MongooseError, ObjectId, Schema } from 'mongoose';
import uuid4 from 'uuid4';
import { ISummary } from './summary-model';

export interface IRoom {
  _id: ObjectId | string;
  urlUUID: string;
  createdAt: number;
  endedAt?: number;
  participants: string[] | ObjectId[];
  transcriptions: string[] | ObjectId[];
  summaries: ObjectId[] | string[] | ISummary[];
  callSummary: ObjectId | string;
  agenda: string[];
}

const RoomSchema = new mongoose.Schema<IRoom>({
  createdAt: {
    type: Number,
  },
  urlUUID: {
    type: String,
    required: true,
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
    type: [Schema.Types.ObjectId],
    ref: 'Summary',
    default: [],
  },
  callSummary: {
    type: String,
    default: '',
  },
  agenda: {
    type: [String],
    default: [],
  },
});

export const Room = mongoose.model<IRoom>('Room', RoomSchema);

// [ START Helpers]
export const create = async (
  agenda: string[]
): Promise<{ room?: IRoom; error?: MongooseError }> => {
  const createdAt = new Date().getTime();
  const urlUUID = uuid4();

  try {
    const room = await Room.create({
      urlUUID,
      createdAt,
      agenda,
    });
    return { room };
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log(mongooseError.message);
    return { error: mongooseError };
  }
};

export const updateRoomWithSummary = async (
  roomId: string,
  summaryId: ObjectId | string
): Promise<{ success: boolean; error?: MongooseError }> => {
  try {
    await Room.findByIdAndUpdate(roomId, {
      $push: { summaries: summaryId },
    }).orFail();
    return { success: true };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { success: false, error: mongooseError };
  }
};

export const fetchRoomByUrl = async (
  url: string
): Promise<{ room?: IRoom; error?: MongooseError }> => {
  try {
    const room = await Room.findOne({ urlUUID: url }).orFail();
    return { room };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};

export const fetchRoomSummariesFromUrl = async (
  url: string
): Promise<{ summaries?: ISummary[]; error?: MongooseError }> => {
  try {
    const room = await Room.findOne({ urlUUID: url })
      .populate('summaries')
      .select('summaries');
    return { summaries: room?.summaries as ISummary[] };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};

export const validateRoomUrl = async (
  url: string
): Promise<{ valid: boolean }> => {
  try {
    await Room.findOne({ urlUUID: url }).orFail();
    return { valid: true };
  } catch (_) {
    return { valid: false };
  }
};
