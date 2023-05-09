import mongoose, { MongooseError, ObjectId } from "mongoose";

export interface ISummary {
  _id: ObjectId | string,
  timestamp: number,
  room: ObjectId,
  //! possibly with markdown 
  text: string
}

const SummarySchema = new mongoose.Schema<ISummary>({
  timestamp: {
    type: Number,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
})

export const Summary = mongoose.model<ISummary>('Summary', SummarySchema);

export const createSummary = async (data: ISummary): Promise<{ summary?: ISummary; error?: MongooseError}> => {
  try {
    const summary = await Summary.create(data);
    return {summary};
  } catch (error) {
    const mongooseError = error as MongooseError;
    return { error: mongooseError };
  }
}