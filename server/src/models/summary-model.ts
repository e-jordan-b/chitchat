import mongoose, { MongooseError, ObjectId } from 'mongoose';

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
