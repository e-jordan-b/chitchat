import { MongooseError, ObjectId, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  _id?: ObjectId | string;
  email: string;
  password?: string;
  createdRooms: ObjectId[] | string[];
  participatedRooms: ObjectId[] | string[];
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  createdRooms: {
    type: [Schema.Types.ObjectId],
    ref: 'Room',
    default: [],
  },
  participatedRooms: {
    type: [Schema.Types.ObjectId],
    ref: 'Room',
    default: [],
  },
});

export const User = model<IUser>('User', UserSchema);

// [ START Helpers ]
export const create = async (
  email: string,
  password: string
): Promise<{ user?: IUser; error?: MongooseError }> => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ email, password: hashedPassword });

    return {
      user: {
        _id: user.id,
        email: user.email,
        createdRooms: user.createdRooms,
        participatedRooms: user.participatedRooms,
      },
    };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};

export const findUserByEmail = async (
  email: string
): Promise<{ user?: IUser; error?: MongooseError }> => {
  try {
    const user = await User.findOne({ email }).orFail();
    return {
      user: {
        _id: user.id,
        email: user.email,
        password: user.password,
        createdRooms: user.createdRooms,
        participatedRooms: user.participatedRooms,
      },
    };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};

export const findUserById = async (
  id: string
): Promise<{ user?: IUser; error?: MongooseError }> => {
  try {
    const user = await User.findById(id).orFail();
    return {
      user: {
        _id: user.id,
        email: user.email,
        createdRooms: user.createdRooms,
        participatedRooms: user.participatedRooms,
      },
    };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
};

export const addRoomToUser = async (
  userId: string,
  roomId: ObjectId | string
): Promise<{ success: boolean; error?: MongooseError }> => {
  try {
    await User.findByIdAndUpdate(userId, {
      $push: { createdRooms: roomId },
    }).orFail();

    return { success: true };
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { success: false, error: mongooseError };
  }
};
