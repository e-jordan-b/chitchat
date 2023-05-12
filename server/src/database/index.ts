import mongoose, { MongooseError } from 'mongoose';

const connectDB = async (): Promise<{
  success: boolean;
  error?: MongooseError;
}> => {
  console.log(process.env.MONGODB_USER, process.env.MONGODB_PASS);
  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASS;

  const uri = `mongodb+srv://${user}:${pass}@cluster0.yd5d7rf.mongodb.net/?retryWrites=true&w=majority`;


  try {
    await mongoose.connect(uri, { dbName: 'mainDB' }); // mainDB -> This is the name of the DB
    console.log('🚀 Connected to DB');
    return { success: true };
  } catch (error) {
    const mongooseError = error as MongooseError;
    console.log('Error connecting to DB: ', mongooseError.message);
    return { success: false, error: mongooseError };
  }
};

export default connectDB;
